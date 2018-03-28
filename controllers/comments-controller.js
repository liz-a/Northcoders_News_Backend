const Comments = require('../models/comments');
const Users = require('../models/users');


function getCommentsByArticle(req,res,next) {
    return Comments.find({belongs_to: `${req.params.article_id}`})
    .then((comments)=> {
        res.send(comments);
    })
    .catch(next);
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
            res.status(201).send({comment: `${newComment.body}`, status:'added to database'})
        })
    })
    .catch((err)=> {
        console.log(err.errors.name)
        err.errors.body.name === "ValidatorError" ? next({status: 400, msg: "Input not valid", err: err}) : next(err);
    });
}

function alterCommentVotes(req,res,next){
    let comment_id = req.params.comment_id;
    let votes;
    (req.query.vote === 'up') ? votes = 1 :
    (req.query.vote === 'down') ? votes = -1 : votes = 0;
        return Comments.update({_id: comment_id},{
            $inc: {votes: votes},
            $set: {_id: comment_id}
            })
            .then(() => {
                return Comments.find({_id: comment_id})
            })
            .then(comment => {
                res.status(200).send(comment)
            })
            .catch(next);
}

function deleteComment(req,res,next){
    let comment_id = req.params.comment_id;
    return Comments.deleteOne({_id: comment_id})
        .then(()=> {
            return Comments.find()
        })
        .then((comments) => 
        res.status(200).send({comment_id:`${comment_id}`, status: 'deleted', comment_count: comments.length, comments: comments}))
        // .then(() => {
        //     return Comments.find({_id: comment_id})
        // })
        // .then(res => console.log({findRes: res}))
        .catch(next);
}

module.exports = {getCommentsByArticle, addCommentByArticle, alterCommentVotes, deleteComment};