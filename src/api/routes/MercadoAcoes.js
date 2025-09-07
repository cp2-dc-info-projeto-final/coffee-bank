var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');

router.post("/:id",async function(req,res,next){
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
})
router.get("/",async function(req,res,next){
    const Investimento = await pool.query('SELECT * FROM "Investimento" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL;');
    return res.status(200).json({
        Sucess:true,
        Data:Investimento.rows
    })
})
router.put("/price",async function(req,res,next){
    const {min,max}=req.body
    if(!min && !max){
        return res.status(400).json({
            Sucess:false,
            message:"Filtro nulo",
            Status:400
        })
    }
    else if(min<0 || max<0 || min>max){
        return res.status(400).json({
            Sucess:false,
            message:"Valores inválidos",
            Status:400
        })
    }
    var data=null
    if(!min&&max){
       data=await pool.query(`SELECT * FROM "Investimento" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL AND "Preco"<=$1;`,[max]);
    } else if(!max&&min){
       data=await pool.query(`SELECT * FROM "Investimento" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL AND "Preco">=$1;`,[min]);
    } else if(max && min){
        data=await pool.query(`SELECT * FROM "Investimento" WHERE "Preco" IS NOT NULL AND "Numero" IS NOT NULL AND "Preco">=$1 AND "Preco"<=$2;`,[min,max]);
    }
    if(!data.rows.length){
        return res.status(404).json({
            Success: false,
            message: "Nenhuma ação encontrada nesse intervalo",
            Status: 404
        });
    }
    else{
        return res.status(200).json({
        Sucess:true,
        message:"Operação sucedida",
        data:data.rows
    })
    }
})
module.exports = router;