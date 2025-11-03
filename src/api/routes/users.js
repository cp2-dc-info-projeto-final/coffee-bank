var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const ValidationCPF = require('../Functions/CPFValidation');
const bcrypt = require('bcrypt');
const axios = require("axios");
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../middlewares/auth');

/* GET - Buscar todos os usuários */
router.put('/SaldoCarteiraUsuario',verifyToken, async function(req, res, next) {
  const { CPF } = req.user;
  console.log(req.body)
  const result = await pool.query(
    'SELECT u."Saldo", c."Valor" FROM "Carteira" c INNER JOIN "Users" u ON u."id" = c."Dono" WHERE u."CPF" = $1;',
    [CPF]
  );
  console.log(result.rows,CPF)
  res.json({
    success: true,
    data: result.rows[0]
  });
})

router.get('/',  verifyToken, isAdmin, async function(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM "Users"  LIMIT 100');
    result.rows = await Promise.all(
      result.rows.map(async (user) => {
        try {
          let Imagem = await axios.put("http://localhost:3001/images", {
            "path": `uploads/${user.id}/main.png`
          })
          return {
            ...user,
            "Image": Imagem.data.data
          }
        } catch (e) {
          return user
        }
      })
    )
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
router.get('/:id', verifyToken, isAdmin, async function(req, res, next) {
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
      data: result.rows[0]});
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
      } = req.body;
    // Validação básica
    if (!CPF ||
      !Nome||
      !Senha5||
      !Senha5conf||
      !Senha7||
      !Senha7conf) {
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
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esse CPF já está cadastrado'
      });
    }
    const Senha5_criptografada = await bcrypt.hash(Senha5, 10)
    const Senha7_criptografada = await bcrypt.hash(Senha7, 10)
    const result = await pool.query(
      `INSERT INTO "Users" ("CPF", "Nome", "Saldo", "Senha5", "Senha7","ChavePix") 
   VALUES ($1, $2, 500, $3, $4,$1) RETURNING *`,
  [CPF, Nome, Senha5_criptografada, Senha7_criptografada]
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
router.put('/Update/:id', verifyToken, async function(req, res, next) {
  try {
    const { id } = req.params;
    const { CPF,
      Nome,
      Senha5,
      Senha5conf,
      Senha7,
      Senha7conf,
      ChavePix,
      Imagem
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
    // Criptografar novas senhas antes de salvar
    const hashedSenha5 = await bcrypt.hash(Senha5, 10);
    const hashedSenha7 = await bcrypt.hash(Senha7, 10);
    const result = await pool.query(
      'UPDATE "Users" SET "CPF"=$1, "Nome"=$2, "Imagem"=$3, "Senha5"=$4, "Senha7"=$5, "ChavePix"=$6, "Sex"=$7 WHERE id=$8 RETURNING *',
      [CPF, Nome, Imagem, hashedSenha5, hashedSenha7, ChavePix, Sex, id]
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
router.delete('/:id', verifyToken, isAdmin, async function(req, res, next) {
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
    try{
      await axios.delete("http://localhost:3001/images", {
  data: {
    path: `uploads/${id}/main.png`
  }
})

    }catch(e){
      console.error(e)
    }
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

router.post('/login', async function(req, res) {
  try {
    const { login, password } = req.body;
    if(!login||!password){
      console.log(login,password)
      return res.status(401).json({
        success:false,
        message:"Credenciais Nulas"
      }) 
    }
    if(typeof(login)!=="string" ||typeof(password) !=="string"||!ValidationCPF(login)|| password.length!==5 && password.length!==12){
      console.log(!ValidationCPF(login))
      return res.status(400).json({
        success:false,
        message:"Credenciais Inválidas"
      })
    }
    var result=null;
    if(password.length==12){
      result = await pool.query(`SELECT 
      "Nome", "CPF", "Senha12" as passwordHash
      FROM "Admins" 
      WHERE "CPF" = $1`, [login]);
    }
    else{
      result = await pool.query(`SELECT 
      id, "Nome", "CPF","ChavePix","Saldo","Senha5" as passwordhash,"Saldo"
      FROM "Users" 
      WHERE "CPF" = $1`, [login]);
    }
    // obtém o usuário do banco de dados

    /*
     tratar login inválido igual senha incorreta
     confere maior segurança por não expor indiretamente
     se existe uma conta com aquele login 
    */
    if (result.rows.length === 0) {
      // https status 401 - unauthorized
      return res.status(401).json({
        success: false,
        message: 'Credenciais não cadastradas'
      });
    }

    // Objeto de usuário
    const roles={
      12:"admin",
      5:"user"
    }
    var user = {...result.rows[0],role:roles[password.length]};
    /*
     verifica a senha passando senha do forntend e hash armazenada
     a partir da hash não se pode descobrir a senha
     mas fornecendo a senha dá para aplicar a hash e ver coincidem
    */
    
    bcrypt.compare(password, user.passwordhash, async (err, isMatch) => {
      if (err) {
        console.error('Erro no bcrypt:', err);
        // https status 500 - internal server error
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
      
      if (!isMatch) {
        // https status 401 - unauthorized
        return res.status(401).json({
          success: false,
          message: 'Credenciais não cadastradas'
        });
      }
      // Cria o token com as informações do usuário logado e sua chave pública
      const token = jwt.sign(
        { 
          id: user.id,
          Saldo:user.Saldo,
          CPF:user.CPF,
          role: user.role,
        }, 
        process.env.JWT_SECRET, //chave secreta, nunca exponha!! >>> PERIGO <<<
        { expiresIn: '30min' } 
      );

      // Registrar login no sistema de atividade unificada
      try {
        await pool.query('SELECT log_unified_activity($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
          user.id,
          user.role,
          'LOGIN',
          `${user.role === 'admin' ? 'Administrador' : 'Usuário'} fez login no sistema`,
          'account',
          user.id,
          req.ip || req.connection.remoteAddress,
          req.get('User-Agent'),
          JSON.stringify({ loginTime: new Date().toISOString() })
        ]);
      } catch (logError) {
        console.error('Erro ao registrar login:', logError);
      }

      // O token contém as informções do usuário com a chave para posterior validação
      return res.status(200).json({
        success: true,
        token: token,
        message: 'Autenticado com sucesso!'
      });
    });

  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    // http status 500 - Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
  
});

/*Hora Da Consulta*/
router.put('/search', verifyToken, isAdmin, async function(req, res, next) {
  try {
    const { CPF } = req.body;
    const result = await pool.query(
      'SELECT "id", "CPF", "Nome", "Saldo", "ChavePix" FROM "Users" WHERE "CPF" LIKE $1',
      [`%${CPF}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    result.rows = await Promise.all(
      result.rows.map(async (user) => {
        try {
          let Imagem = await axios.put("http://localhost:3001/images", {
            "path": `uploads/${user.id}/main.png`
          })
          return {
            ...user,
            "Image": Imagem.data.data
          }
        } catch (e) {
          return user
        }
      })
    )
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});
router.put('/Name', verifyToken, async function(req, res, next) {
  const {CPF}=req.body
  if(!CPF){
    return res.status(400).json({
      "status":400,
      "message":"CPF nulo"
    })
  }
  const result = await pool.query(
    `SELECT "Nome" FROM "Users" WHERE "CPF" = $1`,
    [CPF]
  )
  if(!result.rows.length){
    console.log(CPF,result.rows)
    return res.status(404).json({
      "status":404,
      "message":"CPF não cadastrado"
    })
  }
  else{
    const id = await pool.query(
      'SELECT "id" FROM "Users" WHERE "CPF" LIKE $1',
      [`%${CPF}%`]
    );
    var Imagem={data:{data:null}}
    try{
      Imagem = await axios.put("http://localhost:3001/images", {
        "path": `uploads/${id.rows[0].id}/main.png`
      })
    }
    catch(e){
      console.log(e)
    }
    const response={
      "status":200,
      "message":"Consulta realizada",
      "Image":Imagem.data.data,
      "Name":result.rows[0].Nome
    }
    return res.status(200).json(response)
  }
})
router.put('/searchCPF',verifyToken, isAdmin, async function(req, res, next) {
  try {
    const { CPF } = req.body;
    const result = await pool.query(
      'SELECT "CPF", "Nome" FROM "Users" WHERE "CPF" LIKE $1',
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
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});
module.exports = router;