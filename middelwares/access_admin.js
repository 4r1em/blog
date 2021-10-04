async function accessAdmin(req, res, next) {
    if (req.user.role === 'admin') return next()
    res.status(400).json("You're not admin");
}

module.exports = accessAdmin