const Comments = require('../models/comments');
const Users = require('../models/users');
const Articles = require('../models/articles')


function getCommentsByArticle(req,res,next) {
    return Promise.all([Comments.find({belongs_to: `${req.params.article_id}`}), Articles.find({_id: `${req.params.article_id}`})])
    .then(([comments, article])=> {
        article.length === 0 ? next({status: 404, msg: `No article found for this id!`}) :
        comments.length === 0 ? next({status: 404, msg: `No comments found for this article!`}): 
        res.send(comments);
    })
    .catch((err)=> {
        err.name === "CastError" ? next({status: 400, msg: "No article found for this id!", err: err}) : next(err);
    });
}

function addCommentByArticle(req, res, next) {
    //errs - trying to add to invalid article_ids
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
        err.errors.body.name === "ValidatorError" ? next({status: 400, msg: "Input not valid", err: err}) : next(err);
    });
}

function alterCommentVotes(req,res,next){
        //errs - trying to update invalid comment_ids (not all caught by catch)
    let comment_id = req.params.comment_id;
    let votes;
    (req.query.vote === 'up') ? votes = 1 :
    (req.query.vote === 'down') ? votes = -1 : votes = 0;
    if(votes === 0) { next({status:400, msg: "Valid formats for vote queries are: '?vote=up' or '?vote=down'"})}
    else 
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
            .catch((err)=> {
                err.name === "CastError" ? next({status: 400, msg: "No comment found for this id!", err: err}) : next(err);
            });
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