const express = require('express');
const router = new express.Router();
const articleModel = require('../../models_mongoDB/articles');
const auth = require('../../middelwares/auth');
const imageModel = require('../../models_mongoDB/images');
const categoryModel = require('../../models_mongoDB/categorys');
const valid = require('../../middelwares/valid_objectid');
const ObjectId = require('mongoose').Types.ObjectId;




// Создание записи

router.post('/article', auth, async (req, res) => {
    if (!ObjectId.isValid(req.body['image_id']) || !ObjectId.isValid(req.body['category_id'])) {
        return res.status(400).json("Not correct ID");
    }
    if (!req.body['category_id'] || !req.body['image_id'] || !req.body.description) {
        return res.status(400).json("Maintain complete data");
    };

    const categoryDb = await categoryModel.find({ "_id": req.body['category_id'] });
    if (!categoryDb.length) return res.status(400).json("No such category");

    const imageDb = await imageModel.find({ "_id": req.body['image_id'] });
    if (!imageDb.length) return res.status(400).json("No such image");

    const article = await articleModel.create({
        ...req.body,
        author_id: req.user['_id'],
        url_img: imageDb[0].url,
        name_category: categoryDb[0].name
    });

    res.status(201);
    res.json(article);
});

// Вывод всех записей

router.get('/articles', auth, async (req, res) => {
    const sort = {};
    if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.sort === 'desc' ? -1 : 1;
    };
    const articles = await articleModel.find().sort(sort);
    if (!articles.length) return res.status(200).json(articles);

    res.status(200);
    res.json(articles);
});

// Вывод всех своих записей

router.get('/article', auth, async (req, res) => {
    const sort = {};
    if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.sort === 'desc' ? -1 : 1;
    }
    const articles = await articleModel.find({ "author_id": req.user['_id'] }).sort(sort);
    if (!articles.length) return res.status(404).json("Article not found!");

    res.status(200)
    res.json(articles)

});

// Вывод всех записей по категориям

router.get('/article/category/:id', auth, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Not correct ID");
    }
    const sort = {};
    if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.sort === 'desc' ? -1 : 1;
    };
    const articles = await articleModel.find({ "category_id": req.params.id }).sort(sort);
    if (!articles.length) return res.status(404).json("Article not found!");

    res.status(200);
    res.json(articles);
});

// Вывод всех записей по подпискам и cвоих

router.get('/article/submit', auth, async (req, res) => {
    const follower = req.user.follower;
    let articles = [];
    for (user of follower) {
        articles.push(await articleModel.find({
            "author_id": user
        }));
    };
    articles.push(await articleModel.find({ "author_id": req.user['_id'] }));

    const fullArticles = articles.reduce((acc, val) => acc.concat(val), []);
    if (!fullArticles.length) return res.status(400).json("No articles")

    res.status(200);
    res.json(fullArticles);
})

// Обновление записи

router.put('/article', [auth, valid], async (req, res) => {
    if (!req.body['category_id'].length && !req.body['description'].length && !req.body['image_id'].length) {
        return res.status(400).json("Enter what you want to update")
    };
    if (!req.body['description'].length) delete req.body['description']
    if (!req.body['category_id'].length) delete req.body['category_id']
    if (!req.body['image_id'].length) delete req.body['image_id']

    if (req.body['image_id'] && !ObjectId.isValid(req.body['image_id'])) {
        return res.status(400).json("Not correct ID")
    };
    if (req.body['category_id'] && !ObjectId.isValid(req.body['category_id'])) {
        return res.status(400).json("Not correct ID")
    };

    const artcleId = req.body.id;
    const adminParams = { "_id": artcleId };
    const userParams = { "author_id": req.user["_id"], "_id": artcleId };
    const updateArticleParams = (req.user.role === "admin") ? adminParams : userParams;


    const article = await articleModel.find({ '_id': artcleId });
    if (!article.length) return res.status(404).json("Article not found!");

    if (req.body['category_id']) {
        const categoryDb = await categoryModel.find({ "_id": req.body['category_id'] });
        if (!categoryDb.length) return res.status(400).json("No such category");
        const update = await articleModel.updateOne(updateArticleParams, { name_category: categoryDb[0].name })
        if (update.nModified === 0) {
            return res.status(400).json("You have no rights to replace someone else's data")
        };
    }
    if (req.body['image_id']) {
        const imageDb = await imageModel.find({ "_id": req.body['image_id'] });
        if (!imageDb.length) return res.status(400).json("No such image");
        const update = await articleModel.updateOne(updateArticleParams, { url_img: imageDb[0].url })
        if (update.nModified === 0) {
            return res.status(400).json("You have no rights to replace someone else's data")
        };
    }

    const update = await articleModel.updateOne(updateArticleParams, req.body);
    if (update.nModified === 0) {
        return res.status(400).json("You have no rights to replace someone else's data")
    };
    const updateArticle = await articleModel.find({ '_id': artcleId });

    res.status(200);
    res.json(updateArticle);
});

// Удаление записи

router.delete('/article', [auth, valid], async (req, res) => {

    const artcleId = req.body.id;
    const adminParams = { "_id": artcleId };
    const userParams = { "author_id": req.user["_id"], "_id": artcleId };
    const updateArticleParams = (req.user.role === "admin") ? adminParams : userParams;

    const article = await articleModel.find({ '_id': artcleId });
    if (!article.length) return res.status(404).json("Article not found!");

    const deletedte = await articleModel.deleteOne(updateArticleParams)
    if (deletedte.deletedCount === 0) {
        return res.status(400).json("You do not have permission to delete other people's articles");
    }
    res.status(200);
    res.json('Article deleted');
});


module.exports = router