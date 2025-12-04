var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');
const { verifyToken } = require('../middlewares/auth');

router.post("/:id",async function(req,res,next){
    try{
        const { id } = req.params; // pega id de req.params.id
        const {Preco,quantidade}=req.body
        if(!Preco,!quantidade){
            res.status(400).json({
                Sucess:false,
                message:"Valores nulos",
                Status:400
            })
        }
        else if(quantidade%1!=0 || Preco%1!=0||Preco<0||quantidade<0){
            res.status(400).json({
                Sucess:false,
                message:"Valores não validos",
                Status:400
            })
        }
        const result = await pool.query(` UPDATE "Investimento" 
        SET 
            "Preco" = $1,
            "Numero"= $2
            WHERE "id" = $3 
        RETURNING *;`,[Preco,quantidade,id]);
        if(!result.rows.length){
            return res.status(400).json({
                Sucess:false,
                message:"Ação não encontrada",
                Status:400
            })
        }
        else{
            return res.status(200).json({
                Sucess:true,
                Message:"Venda Inserida",
                Status:200,
                data:result.rows[0]
            })
        }
    }catch(err){
        console.error(err.message)
        return res.status(500).json({
            Success:false,
            message:"erro interno"
        })
    }
})
router.get("/",async function(req,res,next){
    const Investimento = await pool.query('SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL;');
    return res.status(200).json({
        Sucess:true,
        Data:Investimento.rows
    })
})
router.get("/:id",async function(req,res,next){
    const { id } = req.params; // pega id de req.params.id
    const Investimento = await pool.query('SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento"."DF","Investimento"."Nome","Investimento"."AreaVendida","Investimento"."Porcentagem","Investimento"."Preco" FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Investimento"."Preco" IS NOT NULL AND "Investimento"."Numero" IS NOT NULL AND "Investimento"."id" = $1;',[id]);
    return res.status(200).json({
        Sucess:true,
        Data:Investimento.rows
    })
})
router.put('/compraInvestimento/:id',verifyToken, async function(req, res) {
    try {
      const { ChavePix, senha7,Numero } = req.body;
      const { id } = req.params;
      const { CPF } = req.user || {};
      console.log(CPF)
      if (!CPF || !ChavePix || !Numero) {
        return res.status(400).json({ success: false, message: 'Valores nulos' });
      }
      if (!senha7) {
        return res.status(400).json({ success: false, message: 'Senha de transação (Senha7) é obrigatória' });
      }
      if (
        typeof ChavePix !== 'string' ||
        typeof Numero !=="number"||
        typeof CPF !== 'string' 
      ) {
        return res.status(400).json({ success: false, message: 'Valores inválidos' });
      }
      if (!ValidationCPF(CPF) || !ValidationCPF(ChavePix)) {
        return res.status(400).json({ success: false, message: 'CPF ou chave pix inválidos' });
      }

      const emissor=await pool.query('SELECT * FROM "Users" WHERE "Users"."CPF"=$1',[CPF])

      if(!emissor.rows){
        return res.status(404).json({ success: false, message: 'Emissor não encontrado' });
      }

      let carteira = await pool.query(`SELECT id FROM "Carteira" WHERE "Dono" = $1`,[emissor.rows[0].id]);

      if(!carteira.rows.length){
        carteira=await pool.query(`INSERT INTO "Carteira" ("Dono", "Valor") VALUES ($1, 0) RETURNING id;`,[emissor.rows[0].id]);
        console.log(carteira.rows)
      }
      
      const Destinatario = await pool.query('SELECT "Investimento"."Emissor","Investimento"."Preco","Investimento"."AreaVendida","Investimento"."Numero","Users"."Saldo" FROM "Investimento" JOIN "Users" ON "Users".id = "Investimento"."Emissor" WHERE "Investimento"."id"=$1;',[id]);
      console.log(Destinatario.rows)
      if(!Destinatario.rows){
        return res.status(404).json({ success: false, message: 'Destinatario não encontrado' });
      }
      const valor=Destinatario.rows[0].Preco
      if(Number(emissor.rows[0].Saldo)<Number(valor)*Numero){
        return res.status(402).json({ success: false, message: "Saldo insuficiente" });
      }
      const Emissor_novo_saldo=Number(emissor.rows[0].Saldo)-Number(valor)
      const Destinatario_novo_saldo=Number(Destinatario.rows[0].Saldo)+Number(valor)
      console.log(Emissor_novo_saldo,Destinatario_novo_saldo+Number(valor))
      const carteiraSaldo = await pool.query('SELECT "Valor" FROM "Carteira" WHERE "Carteira".id =$1', [carteira.rows[0].id]);
      const carteira_novo_saldo=Number(carteiraSaldo.rows[0].Valor)+Number(valor)
      console.log(Destinatario.rows[0].Emissor)
      await pool.query('UPDATE "Users" SET "Saldo"=$1 WHERE "Users"."id" =$2 RETURNING *', [Emissor_novo_saldo, emissor.rows[0].id])
      await pool.query('UPDATE "Users" SET "Saldo"=$1 WHERE "Users"."id" =$2 RETURNING *', [Destinatario_novo_saldo, Destinatario.rows[0].Emissor])
      
      let acoespossuidas=await pool.query('SELECT "Area" FROM "CarteiraInvestimento" WHERE "CarteiraInvestimento"."Carteira_id" =$1 and "CarteiraInvestimento"."Investimento_id"=$2', [carteira.rows[0].id,id])
      if (acoespossuidas.rows.length){
        let NovaArea=Number(acoespossuidas.rows[0].Area)+Number(Destinatario.rows[0].AreaVendida/Destinatario.rows[0].Numero)
        await pool.query('UPDATE "CarteiraInvestimento" SET "Area" = $1 WHERE "Investimento_id" = $2;', [NovaArea, id])
      }
      else{
        await pool.query('INSERT INTO "CarteiraInvestimento" ("Investimento_id", "Carteira_id", "Area") VALUES ($1, $2, $3)', [id, carteira.rows[0].id, Destinatario.rows[0].AreaVendida/Destinatario.rows[0].Numero]);
      }

      await pool.query('UPDATE "Carteira" SET "Valor"=$1 WHERE "Carteira"."id" =$2', [carteira_novo_saldo, carteira.rows[0].id])

      

      return res.status(200).json({ success: true, message: 'Investimento feito com sucesso'})


    } catch (error) {
      console.error('Erro na rota /compraInvestimento:', error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  });
router.get("/pieGraphic/:id",async function(req,res,next){
    console.log(req)
    const { id } = req.params; // pega id de req.params.id
    const Investimento = await pool.query('SELECT "Investimento"."Porcentagem" FROM "Investimento" WHERE "Investimento"."Preco" IS NOT NULL AND "Investimento"."Numero" IS NOT NULL AND "Investimento"."id" = $1;',[id]);
    console.log(Investimento.rows)
    return res.status(200).json({
        Sucess:true,
        Data:Investimento.rows
    })
})
router.put("/filter/price",async function(req,res,next){
    try {
    let { min, max } = req.body;

    // Convert to numbers just in case strings are sent
    min = min !== undefined ? Number(min) : null;
    max = max !== undefined ? Number(max) : null;
 
    if (min === null && max === null) {
        return res.status(400).json({
            Success: false,
            message: "Filtro nulo",
            Status: 400
        });
    }

    if ((min !== null && min < 0) || (max !== null && max < 0) || (min !== null && max !== null && min > max)) {
        return res.status(400).json({
            Success: false,
            message: "Valores inválidos",
            Status: 400
        });
    }

    let query = `SELECT * FROM "Investimento" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL`;
    let params = [];

    if (min !== null) {
        params.push(min);
        query += ` AND "Preco" >= $${params.length}`;
    }
    if (max !== null) {
        params.push(max);
        query += ` AND "Preco" <= $${params.length}`;
    }

    const data = await pool.query(query, params);

    if (!data.rows.length) {
        return res.status(404).json({
            Success: false,
            message: "Nenhuma ação encontrada nesse intervalo",
            Status: 404
        });
    }
    return res.status(200).json({
        Success: true,
        message: "Operação sucedida",
        data: data.rows
    });

} catch (err) {
    console.error(err.message)
        return res.status(500).json({
            Success: false,
            message: "erro interno"
        });
}

})
router.put("/NameFilter",async function(req,res,next){
    try{
        const {Nome}=req.body
        if(!Nome){
            const Investimento = await pool.query('SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL;');
            return res.status(200).json({
                Sucess:true,
                Data:Investimento.rows
            })
        }
        const Investimento = await pool.query(`SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL AND "Investimento"."Nome" ILIKE '%' || $1 || '%';`,[Nome]);
        return res.status(200).json({
            Sucess:true,
            Data:Investimento.rows
        })
    }
    catch(e){
        console.error(e)
        return res.status(500).json({
            Sucess:false,
            message:"Erro interno"    
        })
    }
})
router.put("/OwnerFilter",async function(req,res,next){
    try{
        const {Nome}=req.body
        if(!Nome){
            const Investimento = await pool.query('SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL;');
            return res.status(200).json({
                Sucess:true,
                Data:Investimento.rows
            })
        }
        const Investimento = await pool.query(`SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL AND "Users"."Nome" ILIKE '%' || $1 || '%';`,[Nome]);
        return res.status(200).json({
            Sucess:true,
            Data:Investimento.rows
        })
    }
    catch(e){
        console.error(e)
        return res.status(500).json({
            Sucess:false,
            message:"Erro interno"    
        })
    }
})

router.put("/ValueFilter",async function(req,res,next){
    try{
        const {valor}=req.body
        console.log(valor)
        const valor1 = valor[1]
        const valor2 = valor[0]
        console.log(valor,valor1,valor2)
    
        if(!valor1 | !valor2){
            const Investimento = await pool.query('SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL;');
            return res.status(200).json({
                Sucess:true,
                Data:Investimento.rows
            })
        }
        
        const Investimento = await pool.query(`SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" >= $1  AND   "Preco" <= $2 AND "Numero" IS NOT NULL;`,[valor1, valor2]);
        return res.status(200).json({
            Sucess:true,
            Data:Investimento.rows
        })
    }
    catch(e){
        console.error(e)
        return res.status(500).json({
            Sucess:false,
            message:"Erro interno"    
        })
    }
})

router.put("/DistrictFilter",async function(req,res,next){
    try{
        const {Df}=req.body
        if(!Df){
            const Investimento = await pool.query('SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL;');
            return res.status(200).json({
                Sucess:true,
                Data:Investimento.rows
            })
        }
        const Investimento = await pool.query(`SELECT "Users"."Nome" AS "DonodoInvestimento", "Investimento".* FROM "Investimento" JOIN "Users" ON "Investimento"."Emissor" = "Users"."id" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL AND "Investimento"."DF" = $1;`,[Df]);
        return res.status(200).json({
            Sucess:true,
            Data:Investimento.rows
        })
    }
    catch(e){
        console.error(e)
        return res.status(500).json({
            Sucess:false,
            message:"Erro interno"    
        })
    }
})
module.exports = router;