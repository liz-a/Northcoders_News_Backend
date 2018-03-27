if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = process.env.NODE_ENV;
const {Users, Articles, Comments, Topics} = require('../models/index');
const {articlesData, topicsData, usersData} = require(`./${env}Data`);
const {DB} = require('../config');
console.log(env);
let topicIds;
let userIds;

function seedDB(DB_URL) {
    mongoose.connect(DB_URL)
    .then(() => {
        console.log(`connected to ${DB_URL}`)})
    .then(() => {
        mongoose.connection.dropDatabase()
    })
    .then(() => {
        console.log('database dropped');
        return Promise.all([Topics.insertMany(topicsData), Users.insertMany(usersData)])
    })
    .then(([topicDocs, userDocs]) => {
        console.log(`inserted ${topicDocs.length} into topics`);
        console.log(`inserted ${userDocs.length} into users`);
        topicIds = generateTopicIds(topicsData, topicDocs);
        userIds = generateUserIds(usersData, userDocs);


        const newArticleData = articlesData.map(article => {
            article.belongs_to = topicIds[article.topic];
            article.created_by = userDocs[Math.floor(Math.random() * userDocs.length)]._id
            return article;
        })
        return Promise.all([topicDocs, userDocs, Articles.insertMany(newArticleData)])
    })
    .then(([topicDocs, userDocs, articleDocs])=> {
        // console.log(topicDocs);
        // console.log(articleDocs);
        // console.log(userDocs);
    })

}

seedDB(DB);

function generateTopicIds(data, docs) {
    return data.reduce((acc, item, i) => {
        acc[item.title.toLowerCase()] = docs[i]._id;
        return acc;
    },{})
}

function generateUserIds(data, docs) {
    return data.reduce((acc, item, i) => {
        acc[i] = docs[i]._id;
        return acc;
    },{})
}

// function randomiser(array) {
//     return Math.floor(Math.random() * array.length);
// }

