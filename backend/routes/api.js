var express = require('express');
var authRouter = require('./auth');
var shopRouter = require('./shop.route');

var app = express();

app.use('/auth', authRouter);
app.use('/shops', shopRouter);

module.exports = app;
