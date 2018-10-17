
const api_key = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const fromName = 'StartUp Mumbai Admin';
const fromEmail = 'postmaster@nordickandie.eu';

exports.mailForgotPassword = (user) => {

    var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

    var data = {
        to: user.email,
        from:  fromName + '<' + fromEmail + '>',
        subject: 'StartUp Mumbai Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' + process.env.BASE_URL + '/auth/resetpassword/' + user.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
};

exports.mailResetPassword = (user) => {

    var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

    var data = {
        to: user.email,
        from:  fromName + '<' + fromEmail + '>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
};
