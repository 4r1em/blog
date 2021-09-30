const mongoose = require('mongoose');

const categorysSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    deletedAt: {
        type: Date,
        default: null,
    }

}, {
    timestamps: true
});

categorysSchema.virtual('articles', {
    ref: 'Articles',
    localField: '_id',
    foreignField: 'category_id'
});

module.exports = mongoose.model("Categorys", categorysSchema);