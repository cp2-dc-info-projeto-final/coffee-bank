require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Investimento = require('./routes/investment');
var mercado = require("./routes/MercadoAcoes");
var adminRouter = require('./routes/admin');
var transfersRouter = require('./routes/transfers');
var activityRouter = require('./routes/activity');
var unifiedActivityRouter = require('./routes/unified-activity');

var app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5175', 'http://127.0.0.1:5175'],
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json({ limit: '2048mb' })); // ou qualquer tamanho que você desejar
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/investment', Investimento);
app.use("/mercado", mercado);
app.use('/admin', adminRouter);
app.use('/activity', activityRouter);
app.use('/unified-activity', unifiedActivityRouter);
app.use('/', transfersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;