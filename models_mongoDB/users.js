const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        minlength: 4,
        trim: true,
        required: [true, 'We need your name']
    },
    email: {
        type: String,
        minlength: 8,
        trim: true,
        required: [true, 'We need your email']
    },
    password: {
        type: String,
        required: [true, 'Password are required'],
        trim: true,
        minlength: 8,

    },
    role: {
        type: String,
        enum: ["user", "admin"]
    },
    token: {
        type: String
    },
    follower: {
        type: [String]
    },
    deletedAt: {
        type: Date,
        default: null,
    }

}, {
    timestamps: true
});

usersSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
});

usersSchema.statics.publicInfo = async function (condition) {
    let users = await this.find(condition);

    users.forEach(function (part, index, arr) {
        part.password = 'secret';
        part.token = 'secret';
    });

    return users;
}

usersSchema.virtual('articles', {
    ref: 'Articles',
    localField: '_id',
    foreignField: 'author_id'
});


module.exports = mongoose.model('Users', usersSchema);