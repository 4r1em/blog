const path = require('path');
const express = require('express');
const router = new express.Router();

router.get('/articles', async(req, res) => {
    res.render('articles');
});

module.exports = router