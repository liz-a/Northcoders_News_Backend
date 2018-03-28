const seedDB = require('./seed')
if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const {DB} = require('../config');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = process.env.NODE_ENV;
const {Users, Articles, Comments, Topics} = require('../models/index');
const {articlesData, topicsData, usersData} = require(`./${env}-data`);

mongoose.connect(DB)
.then(() => seedDB(DB))
.then(() => {
    console.log('disconnecting in the seed.js')
    return mongoose.disconnect()})
    .catch(console.log);