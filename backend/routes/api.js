var express = require('express');
var authRouter = require('./auth');
var shopRouter = require('./shop.route');
var productRouter = require('./product.route');
var promotionRouter = require('./promotion.route');

var app = express();

app.use('/auth', authRouter);
app.use('/shops', shopRouter);
app.use('/products', productRouter);
app.use('/promotions', promotionRouter);

module.exports = app;
