const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    url: {
        type: String,
        required: true,
        trim: true
    }
});

imagesSchema.virtual('articles', {
    ref: 'Articles',
    localField: '_id',
    foreignField: 'image_id'
});

module.exports = mongoose.model("Images", imagesSchema);