if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bodyParser = require('body-parser')
const app = express();
const {DB} = require('./config');
//CONNECT TO DB HERE
mongoose.connect(DB);

module.exports = app;