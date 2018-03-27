process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
const seedDB = require('../seed/seed');
// const DB = require('../config/test').DB;
const mongoose = require('mongoose');

describe('/api', () => {
    after(() => {mongoose.disconnect()})
    beforeEach(() => {
        return seedDB()
    })
    describe('/articles', () => {
        it('', ()=> {})

    })
});