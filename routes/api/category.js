const express = require('express');
const router = new express.Router();
const categoryModel = require('../../models_mongoDB/categorys');
const auth = require('../../middelwares/auth');
const accessAdmin = require('../../middelwares/access_admin');
const valid = require('../../middelwares/valid_objectid');


// Создание категории

router.post('/category', [auth, accessAdmin], async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.name) return res.send("Enter NAME");
    const category = await categoryModel.create(req.body);

    res.status(201);
    res.send(category);
});

// Вывод всех категорий

router.get('/categories', [auth, accessAdmin], async (req, res) => {
    const categories = await categoryModel.find();
    if (!categories.length) return res.status(200).send(categories);

    res.status(200);
    res.send(categories);
});

// Вывод одной категории

router.get('/category', [auth, accessAdmin, valid], async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.id) return res.status(400).send("Enter ID category");
    const category = await categoryModel.find({ '_id': req.body.id });
    if (!category.length) return res.status(404).send("Such a category does not exist ");


    res.status(200);
    res.json(category);
});

// Обновление категории

router.put('/category', [auth, accessAdmin, valid], async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.id) {
        return res.status(400).send("Enter update ID and what you want to name");
    }
    const category = await categoryModel.find({ '_id': req.body.id });
    if (!category.length) return res.status(404).send("Such a category does not exist ");

    await categoryModel.updateOne({ '_id': req.body.id }, { 'name': req.body.name });
    const updateCategory = await categoryModel.find({ '_id': req.body.id });

    res.status(200);
    res.json(updateCategory);
});

// Удаление категории

router.delete('/category', [auth, accessAdmin, valid], async (req, res) => {
    if (!Object.keys(req.body).length || !req.body.id) return res.status(400).send("Enter delete ID");

    const category = await categoryModel.find({ '_id': req.body.id });
    if (!category.length) return res.status(404).send("Such a category does not exist ");

    await categoryModel.deleteOne({ "_id": req.body.id });

    res.status(200);
    res.send("Category deleted");
});




module.exports = router