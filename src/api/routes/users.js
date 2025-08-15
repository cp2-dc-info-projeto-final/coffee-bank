var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const ValidationCPF = require('../Functions/CPFValidation');
const bcrypt = require('bcrypt');
const axios = require("axios")
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
    const {
      file, 
      CPF,
      Nome,
      Senha5,
      Senha5conf,
      Senha7,
      Senha7conf,
      Sex
      } = req.body;
    // Validação básica
    if (!CPF ||
      !Nome||
      !Senha5||
      !Senha5conf||
      !Senha7||
      !Senha7conf||
    Sex === undefined) {
      console.log("fudeu tudo")
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos'
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
    console.log(Oi)
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esse CPF já está cadastrado'
      });
    }
    Senha5_criptografada= await bcrypt.hash(Senha5, 10)
    Senha7_criptografada= await bcrypt.hash(Senha7, 10)
    const result = await pool.query(
      `INSERT INTO "Users" ("CPF", "Nome", "Saldo", "Senha5", "Senha7","ChavePix","Sex") 
   VALUES ($1, $2, 500, $3, $4,$1,$5) RETURNING *`,
  [CPF, Nome, Senha5_criptografada, Senha7_criptografada,Sex]
    );
    if(file){
      try{
        axios.post('http://localhost:3001/images', {
          // dados enviados no corpo da requisição
          path: `uploads/${result.rows[0].id}/main.png`,
          base64: file
        })
      }catch(e){}
    }
    res.status(200).json({
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
router.put('/Update/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { CPF,
      Nome,
      Senha5,
      Senha5conf,
      Senha7,
      Senha7conf,
      ChavePix,
      Imagem,
      Sex
      } = req.body;
    
    if (!CPF ||
      !Nome||
      !Senha5||
      !Senha5conf||
      !Senha7||
      !Senha7conf) {
        console.log(CPF,Nome,Senha5,Senha5conf,Senha7,Senha7conf);
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos'
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
      'UPDATE "Users" SET "CPF" = $1,"Nome"=$2,"Imagem"=$3,"Senha5"=$4,"Senha7"=$5,"ChavePix"=$6 "sex"=$7 WHERE id = $7 RETURNING *',
      [CPF, Nome, Imagem, Senha5, Senha7, ChavePix, id,Sex]
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
router.put('/Login', async function(req, res, next) {
  try {
    var { CPF, Senha5 } = req.body;
    console.log(CPF)
    // transformar CPF para o formato correto

    if (!CPF || !Senha5) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos'
      });
    }
    if(!ValidationCPF(CPF)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }
    console.log(`SELECT "CPF", "Nome", "Imagem", "Sex","Senha5" FROM "Users" WHERE "CPF" = $1`)
    const result = await pool.query(
      `SELECT * FROM "Users" WHERE "CPF" = $1`,
      [CPF]
    );
    if (result.rows.length === 0) {
      console.log(result)
      return res.status(401).json({
        success: false,
        message: 'CPF incorreto'
      });
    }
    try{
      const image = await axios.put('http://localhost:3001/images', {
        path: `uploads/${result.rows[0].id}/main.png`
      });
      var Image=image.data.data
    }catch(e){
      console.error(e)
      var Image=""
    }
    if (!bcrypt.compare(result.rows[0].Senha5, Senha5)) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }
    result.rows[0].CPF
    const DataSend={
      CPF: result.rows[0].CPF,
      Nome: result.rows[0].Nome,
      Imagem: Image,
      Sex: result.rows[0].Sex
    }
    res.json({
      success: true,
      message: 'Login bem-sucedido',
      ...DataSend
    });
  } catch (err) {
    console.error(err)
    next(err);
  }
});

/*Hora Da Consulta*/
router.put('/search', async function(req, res, next) {
  try {
    const { CPF } = req.body;
    const result = await pool.query(
      'SELECT "CPF", "Nome", "Saldo", "ChavePix", "Sex" FROM "Users" WHERE "CPF" LIKE $1',
      [`%${CPF}%`]
    );

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
