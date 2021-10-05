const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT


router.get('/home', async (req, res) => {
    res.render('home', { port });
});

module.exports = router