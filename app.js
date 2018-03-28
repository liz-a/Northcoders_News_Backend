const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bodyParser = require('body-parser')
const app = express();
const {DB} = require('./config');
const router = require('./routes/api-router');
//CONNECT TO DB HERE
mongoose.connect(DB)
    .then(() => {`app connected to ${DB}`});

app.use(bodyParser.json());

app.use('/api', router);

app.use((err,req,res,next)=> {
    if(err.status === 404){
        res.status(404).send({msg: "page not found"})
    } else {
        next(err);
    }
})

app.use((err,req,res,next)=> {
    res.status(500).send({msg: "internal sever error: ", err})
})

module.exports = app;