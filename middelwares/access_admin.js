async function accessAdmin(req, res, next) {
    if (req.user.role == 'admin') return next()
    res.send("You're not admin");
}

module.exports = accessAdmin