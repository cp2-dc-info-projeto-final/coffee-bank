var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');
const { verifyToken } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

//Transferência de saldo entre usuários
router.put('/trasferencia',verifyToken, async function(req, res) {
  try {
    const { ChavePix, valor, senha7 } = req.body;
    console.log(ChavePix, valor, senha7) 
    const { CPF } = req.user || {};
    console.log(CPF)
    if (!CPF || !ChavePix || !valor) {
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
    const emissor=await pool.query('SELECT * FROM "Users" WHERE "Users"."CPF"=$1',[CPF])
    if(!emissor.rows){
      return res.status(404).json({ success: false, message: 'emissor não encontrado' });
    }
    FormatadedChavePix=ChavePix.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    const Destinatario=await pool.query('SELECT * FROM "Users" WHERE "Users"."ChavePix"=$1;',[FormatadedChavePix])
    if(!Destinatario.rows){
      return res.status(404).json({ success: false, message: 'Destinatario não encontrado' });
    }
    else if(emissor.rows[0].Saldo<valor){
      return res.status(402).json({ success: false, message: "Saldo insuficiente" });
    }
    const Destinatario_novo_saldo=Number(emissor.rows[0].Saldo)+Number(valor)
    const Emissor_novo_saldo=Number(Destinatario.rows[0].Saldo)-Number(valor)
    console.log(Destinatario_novo_saldo,Emissor_novo_saldo)
    
    await pool.query('UPDATE "Users" SET "Saldo" = $1 WHERE id = $2;', [Emissor_novo_saldo, emissor.rows[0].id])
    await pool.query('UPDATE "Users" SET "Saldo" = $1 WHERE id = $2;', [Destinatario_novo_saldo, Destinatario.rows[0].id])


    return res.status(200).json({ success: true, message: 'Transação bem sucedida'})
    
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
      `SELECT t.id, t."Data", t."Valor" as valor,
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
