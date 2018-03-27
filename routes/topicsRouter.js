const router = require('express').Router();
const {getAllTopics} = require('../controllers/topicsController');
const {getArticlesByTopic} = require('../controllers/articlesController');

router.get('/', getAllTopics);
router.get('/:topic_id/articles', getArticlesByTopic);

module.exports = router;