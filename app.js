const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bodyParser = require('body-parser')
const app = express();
const DB = (process.env.NODE_ENV === 'production') ? process.env.DB : require('./config').DB;
const path = require('path');

const router = require('./routes/api-router');

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'views')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//CONNECT TO DB HERE
mongoose.connect(DB)
    .then(() => {`app connected to ${DB}`});

app.use(bodyParser.json());

app.use('/api', router);

app.use('/*', (req,res,next) => {
    next({status:404})
})

app.use((err,req,res,next)=> {
    if(err.status === 404){
        (err.msg) ? res.status(404).send({msg: err.msg}) :
        res.status(404).send({msg: "page not found"});
    } else {
        next(err);
    }
})

app.use((err,req,res,next)=> {
    if(err.status === 400){
        res.status(400).send({msg: err.msg, err: err.err})
    } else {
        next(err);
    }
})

app.use((err,req,res,next)=> {
    res.status(500).send({msg: "internal sever error: ", err})
})

module.exports = app;