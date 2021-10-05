const path = require('path');
const express = require('express');
const router = new express.Router();
const port = process.env.PORT


router.get('/category', async (req, res) => {
    res.render('category', { port });
});


module.exports = router