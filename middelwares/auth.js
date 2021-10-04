const jwt = require('jsonwebtoken')
const User = require('../models_mongoDB/users')
const dotenv = require('dotenv')

dotenv.config();

const auth = async (req, res, next) => {

    try {
        const token = req.cookies.token.trim();
        if (!token) throw new Error();

        const userId = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findOne({
            '_id': userId,
            'token': token
        });

        if (!user) throw new Error();

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json("error: Need auth!");
    }
}

module.exports = auth;