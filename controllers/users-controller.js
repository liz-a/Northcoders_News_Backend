const Users = require('../models/users');

function getUserByUsername(req,res,next) {
    return Users.find({username: req.params.username})
    .then((userObj)=> {
        (userObj.length === 0) ? next({status: 404, msg: `User not found: ${req.params.username}`}):
        res.send({userObj});
    })
    .catch(next);
} 

function getAllUsers(req,res,next) {
    return Users.find()
    .then(users => {
        (users.length === 0) ? next({status: 404, msg: "No topics found!"}) :
        res.send({users});
    })
    .catch(next);
}

module.exports = {getUserByUsername, getAllUsers};