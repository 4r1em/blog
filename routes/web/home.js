const path = require('path');
const express = require('express');
const router = new express.Router();

router.get('/home', async (req, res) => {
    res.render('home');
});

module.exports = router