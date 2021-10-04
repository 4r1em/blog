const express = require('express');
const router = new express.Router();
const userModel = require('../../models_mongoDB/users');
const auth = require('../../middelwares/auth');
const tokenGenerator = require('../../access/generateAccessToken');
const bcrypt = require('bcrypt');
const valid = require('../../middelwares/valid_objectid');
const ObjectId = require('mongoose').Types.ObjectId;



// Создание юзера

router.post('/user', async (req, res) => {

    const role = (req.body.role) ? req.body.role : "user";
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json("To register, enter your email and password");
    };
    const userEmail = await userModel.findOne({ 'email': req.body.email });
    if (userEmail) return res.status(400).json("User with this email already exists");
    if (req.body.password.length < 8) return res.status(400).json("Password length must be greater than 8");

    const user = await userModel.create({ ...req.body, "role": role });

    res.status(201);
    res.json(user);
})

// Вход юзера и создание токена

router.post('/user/auth', async (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json("To enter you need a password and email");
    }
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) return resError(res);

    const user = await userModel.findOne({ 'email': email });
    if (!user) return res.status(400).json("User with this email still exists");

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) return resError(res);

    const userId = user['_id'].toString();
    const token = tokenGenerator(userId);
    res.cookie('token', token)

    await userModel.updateOne({ '_id': userId }, {
        'token': token
    });

    res.status(200);
    res.json({
        "id": userId,
        "token": token
    });
});

// Вывод всех юзеров

router.get('/users', auth, async (req, res) => {
    const user = await userModel.publicInfo();
    if (!user.length) return res.status(200).send(user);
    res.status(200);
    res.send(user);
})

// Вывод одного юзера по ID

router.get('/user/:id', auth, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Not correct ID");
    }
    const user = await userModel.publicInfo({
        '_id': req.params.id
    });
    if (!user.length) return res.status(404).json("User not found!");

    res.status(200);
    res.json(user);
})

// Измененине юзера

router.put('/user', auth, async (req, res) => {
    const userId = (!req.body.id) ? req.user['_id'] : req.body.id;
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json("Not correct ID");
    }
    if (!req.body.name.length && !req.body.password.length && !req.body.email.length && !req.body.role.length) {
        return res.status(400).json("Enter what you want to update")
    };
    if (!req.body.name.length) delete req.body.name
    if (!req.body.password.length) delete req.body.password
    if (!req.body.email.length) delete req.body.email
    if (!req.body.role.length) delete req.body.role
    if (!req.body.id.length) delete req.body.id

    if (req.body.role && req.user.role !== "admin") {
        return res.status(400).json("The role cannot be changed only by the admin");
    };
    if (req.body.id && req.user.role !== "admin") {
        return res.status(400).json("You have no rights to replace someone else's data");
    };

    const user = await userModel.find({ '_id': userId })
    if (!user.length) return res.status(404).json("User not found!");

    await userModel.updateOne({ "_id": userId }, req.body);
    const updateUser = await userModel.publicInfo({ '_id': userId })

    res.status(200);
    res.send(updateUser);
});

// Удаление юзера

router.delete('/user', auth, async (req, res) => {
    const userId = (!req.body.id) ? req.user['_id'] : req.body.id;
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json("Not correct ID");
    }
    if (!req.body.id.length) delete req.body.id

    if (req.body.id && req.user.role !== "admin") {
        return res.status(400).json("You have no rights to replace someone else's data");
    };

    const user = await userModel.find({ '_id': userId })
    if (!user.length) return res.status(404).json("User not found!");

    await userModel.deleteOne({ "_id": userId })

    res.status(200);
    res.json('User deleted');

});

// Подписка на другого юзера

router.put('/user/submit', [auth, valid], async (req, res) => {
    const userId = req.user['_id'];
    const subId = req.body.id

    if (subId == userId) return res.status(400).json("You can't subscribe to yourself")

    const subUserDb = await userModel.find({ '_id': subId });
    if (!subUserDb.length) return res.status(400).json("No such user exists");

    for (let key of req.user.follower) {
        if (key == subId) return res.status(400).json("you are already subscribed");
    };
    await userModel.updateOne({ '_id': userId }, { $push: { 'follower': subId } });

    const user = await userModel.publicInfo({
        '_id': userId
    });
    res.status(200);
    res.json(user);
})



function resError(res) {
    res.status(401);
    res.json('Incorrect username or password');
}

module.exports = router