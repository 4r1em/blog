const express = require('express');
const router = new express.Router();
const userModel = require('../../models_mongoDB/users');
const auth = require('../../middelwares/auth');
const tokenGenerator = require('../../access/generateAccessToken');
const bcrypt = require('bcrypt');
const valid = require('../../middelwares/valid_objectid');



// Создание юзера

router.post('/user', async (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).send("To register, enter your email and password");
    };
    const role = (req.body.role) ? req.body.role : "user";
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send("To register, enter your email and password");
    };
    if (req.body.password.length < 8) return res.status(400).send("Password length must be greater than 8");

    const user = await userModel.create({ ...req.body, "role": role });

    res.status(201);
    res.json(user);
})

// Вход юзера и создание токена

router.post('/user/auth', async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.email || !req.body.password) {
        return res.status(400).send("To enter you need a password and email");
    }
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) return resError(res);

    const user = await userModel.findOne({ 'email': email });
    if (!user) return resError(res);

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) return resError(res);

    const userId = user['_id'].toString();
    const token = tokenGenerator(userId);

    await userModel.updateOne({ '_id': userId }, {
        'token': token
    });

    res.status(200);
    res.send({
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

router.get('/user', [auth, valid], async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.id) {
        return res.status(400).send("Enter ID user");
    };
    const user = await userModel.publicInfo({
        '_id': req.body.id
    });
    if (!user.length) return res.status(404).send("User not found!");

    res.status(200);
    res.json(user);
})

// Измененине юзера

router.put('/user', [auth, valid], async (req, res) => {
    if (!Object.keys(req.body).length) {
        if (req.user.role === "admin") {
            return res.status(400).send("Enter your user ID and what you want to change");
        }
        else if (req.user.role === "user") {
            return res.status(400).send("Enter what you want to change");
        };
    };
    const userId = (!req.body.id) ? req.user['_id'] : req.body.id;
    if (req.body['_id']) {
        return res.status(400).send("Id can not be changed");
    };
    if (req.body.role && req.user.role !== "admin") {
        return res.status(400).send("The role cannot be changed only by the admin");
    };
    if (req.body.id && req.user.role !== "admin") {
        return res.status(400).send("You have no rights to replace someone else's data");
    };

    const user = await userModel.find({ '_id': userId })
    if (!user.length) return res.status(404).send("User not found!");

    await userModel.updateOne({ "_id": userId }, req.body);
    const updateUser = await userModel.publicInfo({ '_id': userId })

    res.status(200);
    res.send(updateUser);
});

// Удаление юзера

router.delete('/user', [auth, valid], async (req, res) => {
    if (!Object.keys(req.body).length && req.user.role === "admin") {
        res.status(400).send("Enter the ID of the person to delete");
    }
    if (req.body.id && req.user.role !== "admin") {
        return res.status(400).send("You do not have permission to delete other users");
    };

    const userId = (!req.body.id) ? req.user['_id'] : req.body.id;
    const user = await userModel.find({ '_id': userId })
    if (!user.length) return res.status(404).send("User not found!");

    await userModel.deleteOne({ "_id": userId })

    res.status(200);
    res.send('User deleted');

});

// Подписка на другого юзера

router.put('/user/submit', [auth, valid], async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.id) {
        return res.status(400).send("Enter ID user");
    };
    const userId = req.user['_id'];
    const subId = req.body.id
    if (subId == userId) return res.status(400).send("You can't subscribe to yourself")

    const subUserDb = await userModel.find({ '_id': subId });
    if (!subUserDb.length) return res.status(400).send("No such user exists");

    for (let key of req.user.follower) {
        if (key == subId) return res.status(400).send("you are already subscribed");
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
    res.send('Incorrect username or password');
}

module.exports = router