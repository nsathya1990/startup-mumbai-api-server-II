const User = require('../models/users');

exports.userSignUp = (req, res, next) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if(err) return next({
            message: "User registeration failed",
            error: err
        });
        res.json({
            message: "User registered successfully",
            status: 200
        });
    });
};
