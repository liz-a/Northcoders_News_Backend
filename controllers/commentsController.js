const Comments = require('../models/comments');

function getCommentsByArticle(req,res,next) {
    return Articles.find({belongs_to: `${req.params.topic_id}`})
    .then((articles)=> {
        res.send(articles);
    })
}

module.exports = {getCommentsByArticle};