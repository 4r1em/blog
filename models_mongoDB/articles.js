const mongoose = require('mongoose')

const articlesSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    description: {
        type: String,
        trim: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Categorys'
    },
    url_img: {
        type: String,
        required: true,
        trim: true
    },
    name_category: {
        type: String,
        required: true,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Articles", articlesSchema)