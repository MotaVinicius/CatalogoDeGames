var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var session = require("express-session");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const originsCors = ['http://localhost:5173','https://visionary-dolphin-4c5211.netlify.app'];

app.use(cors({ origin: originsCors,
methods: ['GET','POST','PUT','DELETE','OPTIONS','HEAD'],
credentials: true, allowedHeaders: ['Content-Type']}));
app.use(session({
    secret: "Cr1pt01d",
    resave: false,
    saveUninitialized: false
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;