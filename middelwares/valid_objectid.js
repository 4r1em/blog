const ObjectId = require('mongoose').Types.ObjectId

async function accessAdmin(req, res, next) {
    if (ObjectId.isValid(req.body.id)) return next()
    res.status(400).json("Not correct ID");
}

module.exports = accessAdmin