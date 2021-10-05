const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT


router.get('/image', async (req, res) => {
    res.render('image', { port });
});


module.exports = router