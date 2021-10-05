const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT


router.get('/articles', async (req, res) => {
    res.render('articles', {port});
});

module.exports = router