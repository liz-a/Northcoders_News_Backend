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

module.exports = {getAllArticles, getArticlesByTopic};