const User = require('../models/users');
const nodemailer = require('nodemailer');

email = process.env.MAILER_EMAIL_ID;
pass = process.env.MAILER_PASSWORD;



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
