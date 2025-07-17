var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const ValidationCPF = require('../Functions/CPFValidation');

/* GET - Buscar todos os usuários */
router.get('/', async function(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM "Users"  LIMIT 100');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* GET parametrizado - Buscar usuário por ID */
router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* POST - Criar novo usuário */
router.post('/', async function(req, res, next) {
  try {
    console.log(req.body)
    const { CPF,
      Nascimento,
      Nome,
      Senha5,
      Senha5conf,
      Senha7,
      Senha7conf,
      } = req.body;
    
    // Validação básica
    if (!CPF ||
      !Nascimento||
      !Nome||
      !Senha5||
      !Senha5conf||
      !Senha7||
      !Senha7conf) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos'
      });
    }
    else if(ValidationCPF(CPF) === false){
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }
    else if (Senha5 !== Senha5conf || Senha7 !== Senha7conf) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não conferem'
      });
    }

    
    // Verificar se o CPF já está em uso
    const existingUser = await pool.query('SELECT id FROM "Users" WHERE "CPF" = $1', [CPF]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esse CPF já está cadastrado'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO "Users" ("CPF", "Nascimento", "Nome", "Saldo", "Senha5", "Senha7") 
   VALUES ($1, $2, $3, 500, $4, $5) RETURNING *`,
  [CPF, Nascimento, Nome, Senha5, Senha7]
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* PUT - Atualizar usuário */
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { CPF,
      Nascimento,
      Nome,
      Senha5,
      Senha5conf,
      Senha7,
      Senha7conf,
      ChavePix,
      Imagem
      } = req.body;
    
    if (!CPF ||
      !Nascimento||
      !Nome||
      !Senha5||
      !Senha5conf||
      !Senha7||
      !Senha7conf) {
        console.log(CPF,Nascimento,Nome,Senha5,Senha5conf,Senha7,Senha7conf);
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos'
      });
    }
    else if(ValidationCPF(CPF) === false){
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }
    else if (Senha5 !== Senha5conf || Senha7 !== Senha7conf) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não conferem'
      });
    }
    
    // Verificar se o usuário existe
    const userExists = await pool.query('SELECT id FROM "Users" WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Verificar se o login já está em uso por outro usuário
    const existingUser = await pool.query('SELECT id FROM "Users" WHERE ("CPF" = $1 or "ChavePix"=$2) AND id != $3', [CPF,ChavePix,id]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'CPF ou ChavePix já está em uso por outro usuário'
      });
    }
    
    const result = await pool.query(
      'UPDATE "Users" SET "CPF" = $1, "Nascimento" = $2,"Nome"=$3,"Imagem"=$4,"Senha5"=$5,"Senha7"=$6,"ChavePix"=$7 WHERE id = $8 RETURNING *',
      [CPF, Nascimento, Nome, Imagem, Senha5, Senha7, ChavePix, id]
    );
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/* DELETE - Remover usuário */
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const userExists = await pool.query('SELECT id FROM "Users" WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    await pool.query('DELETE FROM "Users" WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;