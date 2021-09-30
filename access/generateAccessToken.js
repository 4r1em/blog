const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();

function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOKEN_SECRET);
}

module.exports = generateAccessToken