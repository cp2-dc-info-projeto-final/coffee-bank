var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');
const {verifyToken, isAdmin} = require("../middlewares/auth")

router.post('/', async function(req, res, next) {
    try{
        const {
            CPF,
            Area,
            AreaTotal,
            porcentagem,
            DF,
            Nome,
            Compra} = req.body;
        console.log( CPF,Area,AreaTotal,porcentagem,DF,Nome,Compra )
        if(!CPF||!Nome||!Area||!AreaTotal||!porcentagem||!DF){
            return res.status(400).json({
                Sucess:false,
                Message:"Dados nulos",
                Status:400
            })
        }
        else if(typeof(CPF)!=="string" || typeof(Nome)!=="string" || typeof(Area)!=='number' || typeof(AreaTotal)!=="number" || typeof(porcentagem)!=="number"|| typeof(DF)!="string"){
            return res.status(400).json({
                Sucess:false,
                Message:"Dados Inválidos",
                Status:400
            })
        }
        else if(Area<=0||AreaTotal<=0||Compra<=0){
            return res.status(400).json({
                Sucess:false,
                Message:"Dados Inválidos",
                Status:400
            })
        }
        else if (porcentagem>100){
            return res.status(400).json({
                Sucess:false,
                Message:"Procentagem superior a 100%",
                Status:400
            })
        }
        else if(!ValidationCPF(CPF)){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF inválido",
                Status:400
            })
        }
        const userId = await pool.query(`SELECT id FROM "Users" WHERE "CPF" = $1`,[CPF]);
        if(!userId.rows.length){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF não cadastrado",
                Status:400
            })   
        }
        const result = await pool.query(
        `INSERT INTO "Investimento" ("Preco","AreaTotal", "Numero", "AreaVendida","Nome", "Porcentagem","Emissor","DF","Compra") VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *`,
            [Compra,AreaTotal, 1, Area, Nome,porcentagem,userId.rows[0].id,DF,Compra]
        );
        return res.status(200).json({
            Sucess:true,
            Message:"Cadastro bem sucedido",
            Status:200,
            Data:result.rows[0]
        })
    }catch(err){
        console.error('Erro detalhado:', err);
        return res.status(500).json({
            Success: false,
            message: "erro interno",
            error: err.message
        });
    }
});
router.get('/', async function(req, res, next) {
    const Investimento = await pool.query(`SELECT * FROM "Investimento"`);
    return res.status(200).json({
        Sucess:true,
        Data:Investimento.rows
    })
})

// Busca de CPFs de usuários
router.get('/users-cpf', async function(req, res, next) {
    try {
        const result = await pool.query(`SELECT "CPF", "Nome" FROM "Users" ORDER BY "Nome"`);
        return res.status(200).json({
            Success: true,
            Data: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar CPFs:', error);
        return res.status(500).json({
            Success: false,
            Message: 'Erro interno do servidor'
        });
    }
})
router.put('/CPFsearch', async function(req, res, next) {
    try{
        const {CPF}=req.body
        if(!CPF){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF nulo",
            })
        }
        else if(typeof(CPF)!="string"){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF não é string",
            })
        }
        else if(!ValidationCPF(CPF)){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF Inválido",
            })
        }
        const userId = await pool.query(`SELECT id FROM "Users" WHERE "CPF" = $1`,[CPF]);
        if(!userId.rows.length){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF não cadastrado",
                Status:400
            })   
        }
        const Dados = await pool.query(`SELECT "Users"."Nome" AS "DonodoInvestimento", 
            "Investimento"."Preco","Investimento"."AreaTotal","Investimento"."Numero","Investimento"."AreaVendida","Investimento"."Porcentagem",
            "Investimento"."Nome","Investimento"."Nome","Investimento"."DF"
            FROM "Investimento"
            JOIN "Users" ON "Investimento"."Emissor" = "Users"."id"
            WHERE "Investimento"."Emissor" = $1;`,[userId.rows[0].id]);
        return res.json({
            Sucess:true,
            Message:"Consulta sucedida",
            Status:200,
            Data:Dados.rows
        })
    }catch(err){
        console.error(err.message)
        return res.status(500).json({
            Success: false,
            message: "erro interno"
        });
    }
})
router.put('/Namesearch', async function(req, res, next) {
    try{
        const {Name}=req.body
        if(!Name){
            return res.status(400).json({
                Sucess:false,
                Message:"nome nulo",
            })
        }
        else if(typeof(Name)!="string"){
            return res.status(400).json({
                Sucess:false,
                Message:"Nome não é string",
            })
        }
        const Dados = await pool.query(`
            SELECT 
            "Users"."Nome" AS "DonodoInvestimento", 
            "Investimento"."Preco",
            "Investimento"."AreaTotal",
            "Investimento"."Numero",
            "Investimento"."AreaVendida",
            "Investimento"."Porcentagem",
            "Investimento"."Nome",
            "Investimento"."DF"
            FROM "Investimento"
            JOIN "Users" ON "Investimento"."Emissor" = "Users"."id"
            WHERE "Users"."Nome" ILIKE $1;
        `, [`%${Name}%`]);
        return res.json({
            Sucess:true,
            Message:"Consulta sucedida",
            Status:200,
            Data:Dados.rows
        })
    }catch(err){
        console.error(err.message)
        return res.status(500).json({
            Success: false,
            message: "erro interno"
        });
    }
})
router.put('/:id', async function(req, res, next) {
    try{
        const { id } = req.params; // pega id de req.params.id
        const {
            porcentagem,Nome,CPF,DF,AreaTotal
        }=req.body
        if(!CPF||!Nome||!porcentagem||!DF||!AreaTotal){
            return res.status(400).json({
                Sucess:false,
                Message:"Dados nulos",
                Status:400
            })
        }
        else if(typeof(CPF)!=="string" ||typeof(AreaTotal)!=="number" ||typeof(Nome)!=="string" || typeof(porcentagem)!=="number"|| typeof(DF)!="string"){
            return res.status(400).json({
                Sucess:false,
                Message:"Dados Inválidos",
                Status:400
            })
        }
        else if(porcentagem<=0||AreaTotal<=0){
            return res.status(400).json({
                Sucess:false,
                Message:"Dados Inválidos",
                Status:400
            }) 
        }
        else if (porcentagem>100){
            return res.status(400).json({
                Sucess:false,
                Message:"Procentagem superior a 100%",
                Status:400
            })
        }
        else if(!ValidationCPF(CPF)){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF inválido",
                Status:400
            })
        }
        const userId = await pool.query(`SELECT id FROM "Users" WHERE "CPF" = $1`,[CPF]);
        if(!userId.rows.length){
            return res.status(400).json({
                Sucess:false,
                Message:"CPF não cadastrado",
                Status:400
            })   
        }
        const result = await pool.query(` UPDATE "Investimento" 
    SET 
        "Porcentagem" = $1, 
        "Nome" = $2, 
        "Emissor" = $3, 
        "DF" = $4, 
        "AreaTotal" = $5 
    WHERE "id" = $6 
    RETURNING *;`,[porcentagem,Nome,userId.rows[0].id,DF,AreaTotal,id]);
        if(!userId.rows.length){
            return res.status(400).json({
                Sucess:false,
                Message:"Investimento não cadastrado",
                Status:400
            })   
        }
        else{
            return res.status(200).json({
                Sucess:true,
                Message:"Update sucedido",
                Status:200,
                data:result.rows[0]
            })
        }
    }catch(err){
        console.error(err.message)
        return res.status(500).json({
            Success: false,
            message: "erro interno"
        });
    }
})

/* DELETE - Remover fundo imobiliário */
router.delete('/:id', async function(req, res, next) {
    try {
    
    const { id } = req.params;
      
      // Verificar se o fundo imobiliário existe
      const userExists = await pool.query('SELECT id FROM "Investimento" WHERE id = $1', [id]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Fundo imobiliário não encontrado'
        });
      }
      
      await pool.query('DELETE FROM "Investimento" WHERE id = $1', [id]);
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
        message: 'Fundo imobiliário deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar fundo imobiliário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  });
module.exports = router;