var express = require('express');
var router = express.Router();
var ValidationCPF=require("../Functions/CPFValidation")
const pool = require('../db/config');
const { verifyToken } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

router.put('/trasferencia', verifyToken, async function(req, res, next) {
  var {ChavePix,valor, senha7}=req.body
  var {CPF}=req.user
  if(!CPF||!ChavePix||!valor){
    return res.status(400).json({
      status:400,
      success:false,
      message:"Valores nulos"
    })
  }
  else if(typeof(ChavePix)!=="string"||typeof(CPF)!=="string"||typeof(valor)!=="number"&&typeof(valor)!=="Number"&&typeof(valor)!=="Numeric"){
    return res.status(400).json({
      status:400,
      success:false,
      message:"Valores inválidos"
    })
  }
  else if (!ValidationCPF(CPF)||!ValidationCPF(ChavePix)||valor<=0){
    return res.status(400).json({
      status:400,
      success:false,
      message:"CPF ou chave pix inválidos"
    })
  }
  const remetente = await pool.query(`SELECT id,"Saldo","Senha7" FROM "Users"  WHERE "CPF" = $1`,[CPF]);
  const destinatario = await pool.query(`SELECT id,"Saldo" FROM "Users"  WHERE "ChavePix" = $1`,[ChavePix]);
  if(!remetente.rows||!destinatario.rows){
    return res.status(404).json({
      status:404,
      success:false,
      message:"Remetente ou destinatário não encontrado"
    })
  }
  const match = await bcrypt.compare(senha7, user.Senha7);
  if(!match){
    return res.status(401).json({
      status:401,
      success:false,
      message:"Senha inválida"
    })
  }
  else if(remetente.rows[0].Saldo<valor){
    return res.status(404).json({
      status:400,
      success:false,
      message:"Saldo insuficiente"
    })
  }
  
  const NovosaldoRemetente=remetente.rows[0].Saldo-valor
  const NovosaldoDestinatario=destinatario.rows[0].Saldo+valor
  await pool.query(`
  UPDATE "Users" SET "Saldo" = $1 WHERE id = $2;
  UPDATE "Users" SET "Saldo" = $3 WHERE id = $4;
  `,[NovosaldoRemetente,remetente.rows[0].id,NovosaldoDestinatario,destinatario.rows[0].id]);
  return res.result(200).json({
    status:200,
    success:true,
    message:"Transferência sucedida"
  })
})
