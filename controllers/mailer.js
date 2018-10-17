
var mailgun = require("mailgun-js");
const api_key = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

exports.mailgunMailer = (data) => {
    console.log(data);
    let fromName = 'StartUp Mumbai Admin';
    let fromEmail = 'postmaster@nordickandie.eu';

    var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });
    console.log(data);
    var data = {
        to: data.email,
        from: 'StartUp Mumbai Admin <' + fromEmail + '>',
        subject: 'StartUp Mumbai Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' + process.env.BASE_URL + '/reset/' + data.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
}
