const express = require('express');
const router = new express.Router();
const categoryModel = require('../../models_mongoDB/categorys');
const auth = require('../../middelwares/auth');
const accessAdmin = require('../../middelwares/access_admin');
const valid = require('../../middelwares/valid_objectid');
const ObjectId = require('mongoose').Types.ObjectId;


// Создание категории

router.post('/category', [auth, accessAdmin], async (req, res) => {
    if (!req.body.name) return res.status(400).json("Enter NAME");
    const category = await categoryModel.create(req.body);

    res.status(201);
    res.json(category);
});

// Вывод всех категорий

router.get('/categories', [auth, accessAdmin], async (req, res) => {
    const categories = await categoryModel.find();
    if (!categories.length) return res.status(200).json(categories);

    res.status(200);
    res.json(categories);
});

// Вывод одной категории

router.get('/category/:id', [auth, accessAdmin], async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Not correct ID");
    }
    const category = await categoryModel.find({ '_id': req.params.id });
    if (!category.length) return res.status(404).json("Such a category does not exist ");


    res.status(200);
    res.json(category);
});

// Обновление категории

router.put('/category', [auth, accessAdmin, valid], async (req, res) => {

    if (!req.body.name.length) return res.status(400).json("Enter update ID and what you want to name");

    const category = await categoryModel.find({ '_id': req.body.id });
    if (!category.length) return res.status(404).json("Such a category does not exist ");

    await categoryModel.updateOne({ '_id': req.body.id }, { 'name': req.body.name });
    const updateCategory = await categoryModel.find({ '_id': req.body.id });

    res.status(200);
    res.json(updateCategory);
});

// Удаление категории

router.delete('/category', [auth, accessAdmin, valid], async (req, res) => {
    const category = await categoryModel.find({ '_id': req.body.id });
    if (!category.length) return res.status(404).json("Such a category does not exist ");

    await categoryModel.deleteOne({ "_id": req.body.id });

    res.status(200);
    res.json("Category deleted");
});




module.exports = router