const express = require('express');
const router = new express.Router();
const imageModel = require('../../models_mongoDB/images');
const auth = require('../../middelwares/auth');
const accessAdmin = require('../../middelwares/access_admin');
const valid = require('../../middelwares/valid_objectid');
const ObjectId = require('mongoose').Types.ObjectId;
// Создание картинки

router.post('/image', [auth, accessAdmin], async (req, res) => {
    if (!req.body.url) return res.status(400).send("Enter URL");
    const image = await imageModel.create(req.body);

    res.status(201);
    res.json(image);
});

// Вывод всех картинок

router.get('/images', auth, async (req, res) => {
    const images = await imageModel.find();
    if (!images.length) return res.status(200).send("images");

    res.status(200);
    res.json(images);
});

// Вывод одной картинки

router.get('/image/:id', [auth, accessAdmin], async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Not correct ID");
    }
    const image = await imageModel.find({ '_id': req.params.id });
    if (!image.length) return res.status(404).send("Such a picture does not exist ");


    res.status(200);
    res.json(image);
});

// Обновлние картинки

router.put('/image', [auth, accessAdmin, valid], async (req, res) => {

    if (!req.body.url.length) return res.status(400).send("Enter update ID and what you want to url");

    const image = await imageModel.find({ '_id': req.body.id });
    if (!image.length) return res.status(404).send("Such a picture does not exist ");

    await imageModel.updateOne({ '_id': req.body.id }, { 'url': req.body.url });
    const updateImage = await imageModel.find({ '_id': req.body.id });

    res.status(200);
    res.json(updateImage);
});

// Удаление картинки

router.delete('/image', [auth, accessAdmin, valid], async (req, res) => {
    const image = await imageModel.find({ '_id': req.body.id });
    if (!image.length) return res.status(404).send("Such a picture does not exist ");

    await imageModel.deleteOne({ '_id': req.body.id });

    res.status(200);
    res.send("Image deleted");
});


module.exports = router