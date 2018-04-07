const router = require('express').Router();
const {getAllArticles, alterVoteCount, getArticlesById} = require('../controllers/articles-controller');
const {getCommentsByArticle, addCommentByArticle} = require('../controllers/comments-controller');

router.get('/', getAllArticles);
router.get('/:article_id/comments', getCommentsByArticle);
router.get('/:article_id', getArticlesById)
router.post('/:article_id/comments', addCommentByArticle);
router.put('/:article_id', alterVoteCount);

module.exports = router;