process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
const seedDB = require('../seed/test.seed');


describe('/api', () => {
    let actors, movies, companies;
    beforeEach(() => {
        return seedDB().then((data) => {
            [actorDocs, movieDocs, companyDocs] = data;
        })
    })
});