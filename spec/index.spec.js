process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
const DB = require('../config/test').DB;
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/api', () => {
    let topicDocs, userDocs, articleDocs, commentDocs, commentsFilteredByArticle, commentCount, comment, comment0Id;
    beforeEach(() =>  {
        return seedDB(DB)
            .then(data => {
                [topicDocs, userDocs, articleDocs, commentDocs] = data;
            })
            .then(() => {
                commentsFilteredByArticle = commentDocs.filter(doc => {
                    if(doc.belongs_to === articleDocs[0]._id)
                    return doc
                })
                commentCount = commentsFilteredByArticle.length
                comment = commentsFilteredByArticle[0].body
            })
    })
    after(() => {
        return mongoose.connection.close()
            .then(() => console.log('disconnect'))
    })
    describe('/topics', () => {
        it('GET / returns all the topic objects', ()=> {
            return request
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body.topics.length).to.equal(2);
                    expect(res.body.topics[0].title).to.equal('Mitch');
                })
        })
        it('GET /:topic_id/articles returns articles by topic id and includes a comment count', ()=> {
            return request
                .get(`/api/topics/${topicDocs[0]._id}/articles`)
                .expect(200)
                .then(res => {
                    expect(res.body.articles.length).to.equal(2);
                    expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man');
                    expect(res.body.articles[0]).to.have.all.keys('_id', 'votes', 'title', 'body', 'belongs_to', 'created_by', '__v', 'comment_count');
                })
        })
    })
    describe('/articles', () => {
        it('GET / returns all articles and includes a comment count', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(res => {
                    expect(res.body.articles.length).to.equal(4);
                    expect(res.body.articles[1].title).to.equal('7 inspirational thought leaders from Manchester UK');
                    expect(res.body.articles[0]).to.have.all.keys('_id', 'votes', 'title', 'body', 'belongs_to', 'created_by', '__v', 'comment_count')
            })
        })
        it('GET /:article_id/comments returns all comments belonging to a specific article', () => {
            return request
            .get(`/api/articles/${articleDocs[0]._id}/comments`)
            .expect(200)
            .then(res => {
                expect(res.body.comments.length).to.equal(commentCount);
                expect(res.body.comments[0].body).to.equal(comment);
            })
        })
        it('GET /:article_id returns article by id', () => {
            return request
            .get(`/api/articles/${articleDocs[0]._id}`)
            .expect(200)
            .then(res => {
                expect(res.body.article.length).to.equal(1);
                expect(res.body.article[0].title).to.equal('Living in the shadow of a great man');
            })
        })
        it('POST /:article_id/comments adds a comment to a specific article', () => {
            const newComment = {
                "comment": "This is a new comment!!"
            }
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(newComment)
                .expect(201)
                .then(res => {
                    expect(res.body.comment).to.equal(newComment.comment)
                    return request 
                    .get(`/api/articles/${articleDocs[0]._id}/comments`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.comments.length).to.equal(commentCount + 1)
                    })
                })
        })
        it('PUT /:article_id?vote=up increments the vote count for a specific article by one', () => {
            return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    expect(res.body.article.votes).to.equal(1)
                })
        })
        it('PUT /:article_id?vote=down decrements the vote count for a specific article by one', () => {
            return request
            .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
            .expect(200)
            .then(res => {
                console.log(res.body.article)
                expect(res.body.article.votes).to.equal(-1)
            })
        })
        // it('PUT /:article_id?vote=down returns 400 error when passed an id for a non-existent article', () => {
        //     return request
        //     .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
        //     .expect(200)
        //     .then(res => {
        //         expect(res.body.article[0].votes).to.equal(-1)
        //     })
        // })
    })
    describe('/comments', () => {
        it('PUT /:comment_id?vote=up increments the vote count for a specific comment by one', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    expect(res.body.comment[0].votes).to.equal(1)
                })
        })
        it('PUT /:comment_id?vote=down decrements the vote count for a specific comment by one', () => {
            return request
            .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
            .expect(200)
            .then(res => {
                expect(res.body.comment[0].votes).to.equal(-1)
            })
        })
        it('DELETE /:comment_id deletes a comment by id', () => {
            return request
                .delete(`/api/comments/${commentDocs[0]._id}`)
                .expect(200)
                .then(res => {
                    expect(res.body.comment_count).to.equal(commentDocs.length - 1);
                    expect(res.body.comments).to.not.deep.include(commentDocs[0]);
                }) 
        })
    })
    describe('/users', () => {
        it('GET /:username returns a user object for a specific username', () => {
            return request
            .get(`/api/users/${userDocs[0].username}`)
            .expect(200)
            .then(res => {
                expect(res.body.userObj.length).to.equal(1);
                expect(res.body.userObj[0].name).to.equal('jonny');
            })
        })
        it('GET / returns all the user objects', () => {
            return request
            .get(`/api/users`)
            .expect(200)
            .then(res => {
                expect(res.body.users.length).to.equal(2);
                expect(res.body.users[0].name).to.equal('jonny');
            })
        })
    })
});