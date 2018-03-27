if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const env = process.env.NODE_ENV;
const {Users, Articles, Comments, Topics} = require('../models/index');
const {articlesData, topicsData, usersData} = require(`./${env}Data`);
const {DB} = require('../config');
const faker = require('faker');
let topicIds;
let userIds;

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
        let commentsArray = [];
        articleDocs.forEach(article => {
            let random = Math.floor(Math.random() * 10) + 1;
            for(let i = 0; i < random; i++){
                commentsArray.push(new Comments({
                    body: faker.fake("{{lorem.sentence}}"),
                    belongs_to: article._id,
                    created_by: userDocs[Math.floor(Math.random() * userDocs.length)]._id
                }))
            }
        })
        return Promise.all([topicDocs, userDocs, articleDocs, Comments.insertMany(commentsArray)]);
    })
    .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
        console.log(`inserted ${commentDocs.length} into comments`);
    })
}

seedDB(DB);

module.exports = seedDB;


