const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllArticles(req,res,next) {
    return Promise.all([Articles.find().lean(), Comments.find()])
.then(([articles, comments]) => {
    let commentArticleKey = comments.reduce((acc, val) => {
        (acc[val.belongs_to]) ?
            acc[val.belongs_to] = acc[val.belongs_to] + 1 : acc[val.belongs_to] = 1;
        return acc;
    }, {})

    return articles.map(article => {
        article.comment_count = commentArticleKey[article._id]
        return article;
    })
})
.then(articles => {
    res.send(articles);
})
.catch(next);
}

function getArticlesByTopic(req,res,next) {
    return Articles.find({belongs_to: `${req.params.topic_id}`})
    .then((articles)=> {
        res.send(articles);
    })
    .catch(next);
}

function alterVoteCount(req,res,next) {
    let article_id = req.params.article_id;
    let votes;
    (req.query.vote === 'up') ? votes = 1 :
    (req.query.vote === 'down') ? votes = -1 : votes = 0;
        return Articles.update({_id: article_id},{
            $inc: {votes: votes},
            $set: {_id: article_id}
            })
            .then(() => {
                return Articles.find({_id: article_id})
            })
            .then(article => {
                res.status(200).send(article)
            })
            .catch(next);
}

module.exports = {getAllArticles, getArticlesByTopic, alterVoteCount};
