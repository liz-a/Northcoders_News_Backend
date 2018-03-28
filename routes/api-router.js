const router = require('express').Router();
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/topics', topicsRouter);
router.use('/users', usersRouter);

module.exports = router;