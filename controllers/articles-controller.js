const Articles = require('../models/articles');
const Comments = require('../models/comments');
const Users = require('../models/users');

function addCommentCountToArticles(articles, comments) {
    let commentArticleKey = comments.reduce((acc, val) => {
        (acc[val.belongs_to]) ?
            acc[val.belongs_to] = acc[val.belongs_to] + 1 : acc[val.belongs_to] = 1;
        return acc;
    }, {})

    return articles.map(article => {
        article.comment_count = commentArticleKey[article._id] || 0;
        return article;
    })
}

function getAllArticles(req,res,next) {
    return Promise.all([Articles.find().lean(), Comments.find()])
    .then(([articles, comments]) => {
        return addCommentCountToArticles(articles, comments);
    })
    .then(articles => {
        res.send({articles});
    })
    .catch(next);
}

function getArticlesByTopic(req,res,next) {
    return Promise.all([Articles.find({belongs_to: req.params.topic_id}).lean(), Comments.find()])
    .then(([articles, comments]) => {
        if(!articles){next({status: 404, msg: "topic not found"})}
        return addCommentCountToArticles(articles, comments);
    })
    .then(articles => {
        res.send({articles});
    })
    .catch(next);
}

function alterVoteCount(req,res,next) {
    let article_id = req.params.article_id;
    let votes;
    (req.query.vote === 'up') ? votes = 1 :
    (req.query.vote === 'down') ? votes = -1 : votes = 0;
    if(votes === 0) { next({status:400, msg: "Valid formats for vote queries are: '?vote=up' or '?vote=down'"})}
        return Articles.findByIdAndUpdate({_id: article_id},{
            $inc: {votes: votes},
            $set: {_id: article_id}
            },{new: true})
            .then(article => {
                if(article.length === 0) { next({status: 400, msg: "No article found for this id!"})}
                else
                res.status(200).send({article})
            })
            .catch((err)=> {
                console.log(err)
                err.name === "CastError" ? next({status: 400, msg: "No article found for this id!", err: err}) : next(err);
            });
}

function getArticlesById(req,res,next) {
    return Articles.find({_id: req.params.article_id})
    .then((article)=> {
        res.send({article})
    })
    .catch(next);
}

function addArticle(req,res,next) {
    Users.find()
    .then(data => {
        let userId = data[Math.floor(Math.random() * data.length)]._id;
        const newArticle = new Articles({
            "title": req.body.title,
            "body": req.body.article,
            "belongs_to": req.body.topic_id,
            "votes": 0,
            "created_by": userId
        })
        return newArticle.save()
    })
    .then((newArticle) => {
        res.status(201).send({article: `${newArticle.title}`, status:'added to database'})
    })
    .catch((err)=> {
        err.errors.body.name === "ValidatorError" ? next({status: 400, msg: 'Input not valid: accepted format for input is "title": "title of article", "article": "body of article", "topic_id": "id number of topic", please check input and be sure to use double quotation marks', err: err}) : next(err);
    });
}

module.exports = {getAllArticles, getArticlesByTopic, alterVoteCount, getArticlesById, addArticle};
