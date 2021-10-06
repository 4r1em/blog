const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT
const host = process.env.BASE_HOST


router.get('/register', async (req, res) => {
    res.render('register', { port, host });
});


module.exports = router