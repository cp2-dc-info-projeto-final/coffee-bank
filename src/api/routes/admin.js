var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const ValidationCPF = require('../Functions/CPFValidation');

// Função para gerar senha aleatória de 12 dígitos
function generateRandomPassword() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// Login de administrador
router.post('/login', async function(req, res, next) {
  try {
    const { CPF, Senha12 } = req.body;
    
    if (!CPF || !Senha12) {
      return res.status(400).json({
        success: false,
        message: 'CPF e senha são obrigatórios'
      });
    }

    if (!ValidationCPF(CPF)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }

    const result = await pool.query(
      'SELECT * FROM "Admins" WHERE "CPF" = $1',
      [CPF]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'CPF incorreto'
      });
    }

    const isValidPassword = await bcrypt.compare(Senha12, result.rows[0].Senha12);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    const adminData = {
      id: result.rows[0].id,
      CPF: result.rows[0].CPF,
      Nome: result.rows[0].Nome,
      DataCriacao: result.rows[0].DataCriacao
    };

    res.json({
      success: true,
      message: 'Login bem-sucedido',
      data: adminData
    });
  } catch (err) {
    console.error('Erro no login do admin:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Listar todos os administradores
router.get('/', async function(req, res, next) {
  try {
    const result = await pool.query('SELECT id, "CPF", "Nome", "DataCriacao" FROM "Admins" ORDER BY "DataCriacao" DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Criar novo administrador
router.post('/', async function(req, res, next) {
  try {
    const { CPF, Nome} = req.body;
    console.log(CPF,Nome)
    if (!CPF || !Nome) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (!ValidationCPF(CPF)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }

    // Verificar se CPF já existe
    const existingAdmin = await pool.query('SELECT id FROM "Admins" WHERE "CPF" = $1', [CPF]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    // Gerar senha aleatória de 12 dígitos
    const novaSenha = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    const result = await pool.query(
      'INSERT INTO "Admins" ("CPF", "Nome", "Senha12") VALUES ($1, $2, $3) RETURNING id, "CPF", "Nome", "DataCriacao"',
      [CPF, Nome, hashedPassword]
    );

    res.json({
      success: true,
      message: 'Administrador criado com sucesso',
      data: {
        admin: result.rows[0],
        senhaGerada: novaSenha
      }
    });
  } catch (err) {
    console.error('Erro ao criar administrador:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Atualizar administrador
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { Nome, Senha12Confirmacao } = req.body;
    
    if (!Nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório'
      });
    }

    // Verificar se admin existe
    const existingAdmin = await pool.query('SELECT id FROM "Admins" WHERE id = $1', [id]);
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador não encontrado'
      });
    }

    const result = await pool.query(
      'UPDATE "Admins" SET "Nome" = $1 WHERE id = $2 RETURNING id, "CPF", "Nome", "DataCriacao"',
      [Nome, id]
    );

    res.json({
      success: true,
      message: 'Administrador atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Erro ao atualizar administrador:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Excluir administrador
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se admin existe
    const existingAdmin = await pool.query('SELECT id FROM "Admins" WHERE id = $1', [id]);
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador não encontrado'
      });
    }

    await pool.query('DELETE FROM "Admins" WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Administrador excluído com sucesso'
    });
  } catch (err) {
    console.error('Erro ao excluir administrador:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar usuários (para gerenciamento)
router.get('/users', async function(req, res, next) {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT id, "CPF", "Nome", "Saldo", "DataCriacao" FROM "Users"';
    let params = [];
    let paramCount = 0;

    if (search) {
      query += ' WHERE "Nome" ILIKE $1 OR "CPF" ILIKE $1';
      params.push(`%${search}%`);
      paramCount = 1;
    }

    query += ` ORDER BY "DataCriacao" DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Buscar total de usuários para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM "Users"';
    let countParams = [];
    
    if (search) {
      countQuery += ' WHERE "Nome" ILIKE $1 OR "CPF" ILIKE $1';
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Excluir usuário
router.delete('/users/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se usuário existe
    const existingUser = await pool.query('SELECT id FROM "Users" WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Excluir usuário (cascade irá excluir transferências relacionadas)
    await pool.query('DELETE FROM "Users" WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Estatísticas gerais
router.get('/stats', async function(req, res, next) {
  try {
    // Total de usuários
    const totalUsers = await pool.query('SELECT COUNT(*) as total FROM "Users"');
    
    // Total de administradores
    const totalAdmins = await pool.query('SELECT COUNT(*) as total FROM "Admins"');
    
    // Total de transferências
    const totalTransfers = await pool.query('SELECT COUNT(*) as total FROM "Transferencias"');
    
    // Saldo total do sistema
    const totalBalance = await pool.query('SELECT SUM("Saldo") as total FROM "Users"');
    
    // Usuários criados hoje
    const todayUsers = await pool.query(`
      SELECT COUNT(*) as total FROM "Users" 
      WHERE DATE("DataCriacao") = CURRENT_DATE
    `);
    
    // Transferências hoje
    const todayTransfers = await pool.query(`
      SELECT COUNT(*) as total FROM "Transferencias" 
      WHERE DATE("Data") = CURRENT_DATE
    `);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(totalUsers.rows[0].total),
        totalAdmins: parseInt(totalAdmins.rows[0].total),
        totalTransfers: parseInt(totalTransfers.rows[0].total),
        totalBalance: parseInt(totalBalance.rows[0].total) || 0,
        todayUsers: parseInt(todayUsers.rows[0].total),
        todayTransfers: parseInt(todayTransfers.rows[0].total)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
