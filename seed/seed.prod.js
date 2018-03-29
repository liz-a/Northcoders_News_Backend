const seedDB = require('./seed')
process.env.DB = require('../config/production').DB;
const DB = process.env.DB;
const mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect(DB)
.then(() => seedDB(DB))
.then(() => {
    console.log('disconnecting in the seed.js')
    return mongoose.disconnect()})
    .catch(console.log);