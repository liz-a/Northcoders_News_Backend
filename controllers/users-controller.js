const Users = require('../models/users');

function getUserByUsername(req,res,next) {
    return Users.find({username: `${req.params.username}`})
    .then((userObj)=> {
        res.send(userObj);
    })
}

module.exports = {getUserByUsername};