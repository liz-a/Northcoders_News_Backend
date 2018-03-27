const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = process.env.NODE_ENV;
const {Users, Articles, Comments, Topics} = require('../models/index');
const {articlesData, topicsData, usersData} = require(`./${env}Data`);
const {DB} = require('../config');

