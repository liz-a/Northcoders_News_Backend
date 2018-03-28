const router = require('express').Router();
const {getAllTopics} = require('../controllers/topics-controller');
const {getArticlesByTopic} = require('../controllers/articles-controller');

router.get('/', getAllTopics);
router.get('/:topic_id/articles', getArticlesByTopic);

module.exports = router;