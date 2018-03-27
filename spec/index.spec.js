process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
const seedDB = require('../seed/seed');
const DB = require('../config/test').DB;
const mongoose = require('mongoose');

describe('/api', () => {
    beforeEach(() =>  seedDB(DB))
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