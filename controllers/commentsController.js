const Comments = require('../models/comments');
const Users = require('../models/users');
const userId = Users.findOne()._id;

function getCommentsByArticle(req,res,next) {
    return Comments.find({belongs_to: `${req.params.article_id}`})
    .then((comments)=> {
        res.send(comments);
    })
}

function addCommentByArticle(req, res, next) {
    const newComment = new Comments({
        "body": req.body.comment,
        "belongs_to": req.params.article_id,
        "created_by": userId
})
    return newComment.save()
    .then((newComment) => {
        console.log(`comment: ${newComment.body} has been added to the database.`)
        res.status(201).send(newComment)
    })
}


module.exports = {getCommentsByArticle, addCommentByArticle};