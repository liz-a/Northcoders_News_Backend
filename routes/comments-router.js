const router = require('express').Router();
const {alterCommentVotes, deleteComment} = require('../controllers/comments-controller');

router.put('/:comment_id', alterCommentVotes);
router.delete('/:comment_id', deleteComment)

module.exports = router;