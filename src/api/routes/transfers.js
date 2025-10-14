var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');
const { verifyToken } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

//Transferência de saldo entre usuários
router.put('/trasferencia', verifyToken, async function(req, res) {
  try {
    const { ChavePix, valor, senha7 } = req.body;
    const { CPF } = req.user || {};

    const onlyDigits = (s) => String(s || '').replace(/[^0-9]/g, '');
    const cpfDigits = onlyDigits(CPF);
    const chaveDigits = onlyDigits(ChavePix);

    if (!CPF || !ChavePix || valor == null) {
      return res.status(400).json({ success: false, message: 'Valores nulos' });
    }
    if (!senha7) {
      return res.status(400).json({ success: false, message: 'Senha de transação (Senha7) é obrigatória' });
    }
    if (
      typeof ChavePix !== 'string' ||
      typeof CPF !== 'string' ||
      (typeof valor !== 'number' && typeof valor !== 'string') ||
      !(Number(valor) > 0)
    ) {
      return res.status(400).json({ success: false, message: 'Valores inválidos' });
    }
    if (!ValidationCPF(CPF) || !ValidationCPF(ChavePix)) {
      return res.status(400).json({ success: false, message: 'CPF ou chave pix inválidos' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const remetente = await client.query(
        'SELECT id, "Saldo", "Senha7" FROM "Users" WHERE ("CPF" = $1 OR REPLACE(REPLACE(REPLACE("CPF", ".", ""), "-", ""), "/", "") = $2) FOR UPDATE',
        [CPF, cpfDigits]
      );
      const destinatario = await client.query(
        'SELECT id, "Saldo" FROM "Users" WHERE ("ChavePix" = $1 OR REPLACE(REPLACE(REPLACE("ChavePix", ".", ""), "-", ""), "/", "") = $2) FOR UPDATE',
        [ChavePix, chaveDigits]
      );

      if (remetente.rows.length === 0 || destinatario.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Remetente ou destinatário não encontrado' });
      }

      const remetenteRow = remetente.rows[0];
      const destinatarioRow = destinatario.rows[0];

      const match = await bcrypt.compare(String(senha7), remetenteRow.Senha7);
      if (!match) {
        await client.query('ROLLBACK');
        return res.status(401).json({ success: false, message: 'Senha inválida' });
      }

      if (Number(remetenteRow.Saldo) < Number(valor)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Saldo insuficiente' });
      }

      const novoSaldoRemetente = Number(remetenteRow.Saldo) - Number(valor);
      const novoSaldoDestinatario = Number(destinatarioRow.Saldo) + Number(valor);

      await client.query('UPDATE "Users" SET "Saldo" = $1 WHERE id = $2', [novoSaldoRemetente, remetenteRow.id]);
      await client.query('UPDATE "Users" SET "Saldo" = $1 WHERE id = $2', [novoSaldoDestinatario, destinatarioRow.id]);

      // Registra Transferência (usa coluna "VALORr" conforme schema atual)
      await client.query(
        'INSERT INTO "Transferencias" ("Emissor", "Destinatario", "VALORr") VALUES ($1, $2, $3)',
        [remetenteRow.id, destinatarioRow.id, Number(valor)]
      );

      await client.query('COMMIT');

      return res.status(200).json({
        success: true,
        message: 'Transferência sucedida',
        data: { saldo: novoSaldoRemetente }
      });
    } catch (err) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('Erro na transferência:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro na rota /trasferencia:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Histórico de transferências do usuário autenticado
router.get('/transfer/history', verifyToken, async function(req, res) {
  try {
    const { CPF } = req.user || {};
    if (!CPF) return res.status(401).json({ success: false, message: 'Não autenticado' });

    const result = await pool.query(
      `SELECT t.id, t."Data", t."VALORr" as valor,
              u_from."CPF" as emissorCPF, u_to."CPF" as destinatarioCPF,
              u_to."Nome" as destinatarioNome
         FROM "Transferencias" t
         JOIN "Users" u_from ON u_from.id = t."Emissor"
         JOIN "Users" u_to   ON u_to.id   = t."Destinatario"
        WHERE u_from."CPF" = $1
        ORDER BY t."Data" DESC
        LIMIT 50`,
      [CPF]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;
