const router = require('express').Router();
const {getAllComments, alterCommentVotes, deleteComment} = require('../controllers/comments-controller');

router.get('/', getAllComments);
router.put('/:comment_id', alterCommentVotes);
router.delete('/:comment_id', deleteComment)

module.exports = router;