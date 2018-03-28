const Comments = require('../models/comments');
const Users = require('../models/users');


function getCommentsByArticle(req,res,next) {
    return Comments.find({belongs_to: `${req.params.article_id}`})
    .then((comments)=> {
        res.send(comments);
    })
}

function addCommentByArticle(req, res, next) {
    Users.find()
    .then(data => {
        let userId = data[Math.floor(Math.random() * data.length)]._id;
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
    })
}

function alterCommentVotes(req,res,next){
    let comment_id = req.params.comment_id;
    let votes;
    (req.query.vote === 'up') ? votes = 1 :
    (req.query.vote === 'down') ? votes = -1 : votes = 0;
        return Comments.update({_id: comment_id},{
            $inc: {votes: votes},
            $set: {_id: comment_id}
            }, {upsert: true})
            .then(data => {
                return Comments.find({_id: comment_id})
            })
            .then(comment => {
                res.send(comment)
            })
}

function deleteComment(req,res,next){
    let comment_id = req.params.comment_id;
    return Comments.deleteOne({_id: comment_id})
        .then(data => res.send(`${comment_id} deleted`))
}

module.exports = {getCommentsByArticle, addCommentByArticle, alterCommentVotes, deleteComment};