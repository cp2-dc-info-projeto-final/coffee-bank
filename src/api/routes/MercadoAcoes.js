var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');

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
module.exports = router;