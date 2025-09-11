var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const ValidationCPF = require('../Functions/CPFValidation');
const bcrypt = require('bcrypt');
const axios = require("axios")
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../middlewares/auth');

/* GET - Buscar todos os usuários */
router.get('/', async function(req, res, next) {
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
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esse CPF já está cadastrado'
      });
    }
    const Senha5_criptografada = await bcrypt.hash(Senha5, 10)
    const Senha7_criptografada = await bcrypt.hash(Senha7, 10)
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
router.put('/Update/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    console.log(id)
    console.log(req.body)
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
      "Nome", "CPF","ChavePix","Saldo","Senha5" as passwordhash
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
    console.log(user)
    /*
     verifica a senha passando senha do forntend e hash armazenada
     a partir da hash não se pode descobrir a senha
     mas fornecendo a senha dá para aplicar a hash e ver coincidem
    */
    
    bcrypt.compare(password, user.passwordhash, (err, isMatch) => {
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
          login: user.login,
          email: user.email,
          // tipo do usuário, que vem do banco
          role: user.role 
          // a senha não entra no token para não ser exposta
        }, 
        process.env.JWT_SECRET, //chave secreta, nunca exponha!! >>> PERIGO <<<
        { expiresIn: '30min' } 
      );

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
router.put('/search', async function(req, res, next) {
  try {
    const { CPF } = req.body;
    const result = await pool.query(
      'SELECT "id", "CPF", "Nome", "Saldo", "ChavePix", "Sex" FROM "Users" WHERE "CPF" LIKE $1',
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
module.exports = router;