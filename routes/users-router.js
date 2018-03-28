const router = require('express').Router();
const {getUserByUsername} = require('../controllers/users-controller');

router.get('/:username', getUserByUsername);


module.exports = router;