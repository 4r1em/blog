const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT


router.get('/user', async (req, res) => {
    res.render('user', { port });
});


module.exports = router