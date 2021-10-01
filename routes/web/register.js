const path = require('path');
const express = require('express');
const router = new express.Router();

router.get('/register', async (req, res) => {
    res.render('register');
});


module.exports = router