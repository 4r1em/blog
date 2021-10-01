const path = require('path');
const express = require('express');
const router = new express.Router();

router.get('/category', async (req, res) => {
    res.render('category');
});


module.exports = router