const Users = require('../models/users');

function getUserByUsername(req,res,next) {
    return Users.find({username: `${req.params.username}`})
    .then((comments)=> {
        res.send(comments);
    })
}

module.exports = {getUserByUsername};