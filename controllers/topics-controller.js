const Topics = require('../models/topics');

function getAllTopics(req,res,next) {
    return Topics.find()
    .then(topics => {
        (topics.length === 0) ? next({status: 404, msg: "No topics found!"}) :
        res.send(topics);
    })
    .catch(next);
}



module.exports = {getAllTopics};