const User = require('../models/users');
const nodemailer = require('nodemailer');

email = process.env.MAILER_EMAIL_ID;
pass = process.env.MAILER_PASSWORD;



exports.userSignUp = (req, res, next) => {
    if(req.body.name && req.body.email && req.body.password ) {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (user) return res.json({
                message: 'Account with that email address already exists.'
            }); else {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                user.save(function (err) {
                    if (err) return next({
                        message: "User registration failed",
                        error: err
                    });
                    res.json({
                        message: "User registered successfully",
                        status: 200
                    });
                });
            }
        });
    } else {
        return res.json({
            message: "Invalid Inputs",
            status: 500
        });
    }   
};