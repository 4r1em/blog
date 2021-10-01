const path = require('path');
const express = require('express');
const router = new express.Router();

router.get('/image', async (req, res) => {
    res.render('image');
});


module.exports = router