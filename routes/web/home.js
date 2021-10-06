const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT
const host = process.env.BASE_HOST


router.get('/home', async (req, res) => {
    res.render('home', { port, host });
});

module.exports = router