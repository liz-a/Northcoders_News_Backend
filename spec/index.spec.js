process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
const DB = require('../config/test').DB;
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/api', () => {
    let topicDocs, userDocs, articleDocs, commentDocs;
    beforeEach(() =>  {
        return seedDB(DB)
            .then(data => {
                [topicDocs, userDocs, articleDocs, commentDocs] = data;
            })
    })
    after(() => {
        return mongoose.connection.close()
            .then(() => console.log('disconnect'))
    })
    describe('/articles', () => {
        it('', ()=> {})
    })
    describe('/somethingElse', () => {
        it('tests again', () => {})
    })
});