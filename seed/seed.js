if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = process.env.NODE_ENV;
const {Users, Articles, Comments, Topics} = require('../models/index');
const {articlesData, topicsData, usersData} = require(`./${env}Data`);
const {DB} = require('../config');
console.log(env);
let topicIds;

function seedDB(DB_URL) {
    mongoose.connect(DB_URL)
    .then(() => {
        console.log(`connected to ${DB_URL}`)})
    .then(() => {
        mongoose.connection.dropDatabase()
    })
    .then(() => {
        console.log('database dropped');
        return Topics.insertMany(topicsData)
    })
    .then((topicDocs) => {
        console.log(`inserted ${topicDocs.length} into topics`);
        topicIds = generateIds(topicsData, topicDocs);
        const newArticleData = articlesData.map(article => {
            article.belongs_to = topicIds[article.topic];
            return article;
        })
        return Promise.all([topicDocs, Articles.insertMany(newArticleData)])
    })
    .then(([topicDocs, articleDocs])=> {
        console.log(topicDocs);
    })

    
}

seedDB(DB);

function generateIds(data, docs) {
    return data.reduce((acc, item, i) => {
        acc[item.title.toLowerCase()] = docs[i]._id;
        return acc;
    },{})
}