const router = require('express').Router();
const {getUserByUsername, getAllUsers} = require('../controllers/users-controller');

router.get('/', getAllUsers);
router.get('/:username', getUserByUsername);


module.exports = router;