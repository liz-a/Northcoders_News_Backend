const Articles = require('../models/articles');

function getAllArticles(req,res,next) {
return Articles.find()
.then(articles => {
    res.send(articles);
})
}

function getArticlesByTopic(req,res,next) {
    return Articles.find({belongs_to: `${req.params.topic_id}`})
    .then((articles)=> {
        res.send(articles);
    })
}

function alterVoteCount(req,res,next) {
    let article_id = req.params.article_id;
    let votes;
    (req.query.vote === 'up') ? votes = 1 :
    (req.query.vote === 'down') ? votes = -1 : votes = 0;
        return Articles.update({_id: article_id},{
            $inc: {votes: votes},
            $set: {_id: article_id}
            }, {upsert: true})
            .then(data => {
                return Articles.find({_id: article_id})
            })
            .then(article => {
                res.send(article)
            })
}

module.exports = {getAllArticles, getArticlesByTopic, alterVoteCount};