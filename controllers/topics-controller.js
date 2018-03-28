const Topics = require('../models/topics');

function getAllTopics(req,res,next) {
    return Topics.find()
    .then(topics => {
        res.send(topics);
    })
    .catch(next);
}



module.exports = {getAllTopics};