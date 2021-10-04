const path = require('path');
const express = require('express');
const router = new express.Router();

router.get('/user', async (req, res) => {
    res.render('user');
});


module.exports = router