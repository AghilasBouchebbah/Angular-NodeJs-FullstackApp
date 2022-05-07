const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./Routes/user');
const categoryRoute = require('./Routes/category');
const productRoute = require('./Routes/product');
const billRoute = require('./Routes/bill');
const dashboardRoute = require('./Routes/dashboard');

const app = express();



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//ATTENTION, IL FAUT UN ESPACE APRES LA VIRGULE,  j'étais bloqué à cause de ca
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;