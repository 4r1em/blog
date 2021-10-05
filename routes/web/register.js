const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT


router.get('/register', async (req, res) => {
    res.render('register', { port });
});


module.exports = router