const Articles = require('../models/articles');
const Comments = require('../models/comments');

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
        return Articles.update({_id: article_id},{
            $inc: {votes: votes},
            $set: {_id: article_id}
            })
            .then(() => {
                return Articles.find({_id: article_id})
            })
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

module.exports = {getAllArticles, getArticlesByTopic, alterVoteCount, getArticlesById};
