const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

const db = mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

module.exports = db;