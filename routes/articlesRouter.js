const router = require('express').Router();
const {getAllArticles} = require('../controllers/articlesController');
const {getCommentsByArticle, addCommentByArticle} = require('../controllers/commentsController');

router.get('/', getAllArticles);
router.get('/:article_id/comments', getCommentsByArticle);
router.post('/:article_id/comments', addCommentByArticle)

module.exports = router;