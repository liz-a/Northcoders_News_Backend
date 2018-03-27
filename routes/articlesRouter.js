const router = require('express').Router();
const {getAllArticles} = require('../controllers/articlesController');
const {getCommentsByArticle} = require('../controllers/commentsController');

router.get('/', getAllArticles);
router.get('/:article_id/comments', getCommentsByArticle);

module.exports = router;