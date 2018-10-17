const User = require('../models/user');
const jwt = require('jwt-simple');
const moment = require('moment');
const crypto = require('crypto-browserify');

const { mailForgotPassword, mailResetPassword } =  require('../controllers/mailer');


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

exports.postLoginUser = (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) return res.json({
      status: 404,
      message: 'Invalid email and/or password'
    });

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) return res.json({
        status: 404,
        message: 'Invalid email and/or password'
      });

      var token = createJwtToken({
        id: user.id
      });
      res.json({
        status: 200,
        message: 'Successful Login',
        token: token
      });
    });
  });
};

exports.postChangePassword = (req, res, next) => {
  console.log(req.user)
  User.findOne({ _id: req.user.id }).select('password').exec(function (err, user) {
    if (err) {
      throw err
    }
    user.comparePassword(req.body.currentPassword, function (err, isMatch) {
      if (err) {
        throw err
      }
      if (isMatch) {
        user.password = req.body.newPassword
        user.save(function(err,newUser){
          if (err) {
            throw err
          }
          res.json({
            status: 200,
            message:'password change successfully'
          })
        })
      }
      else
      {
        res.json({
          status: 401,
          message:'password incorrect'
        })
      }
    })
  })

}

exports.getMe = (req, res, next) => {
  User.findOne({ _id: req.user.id }).select('-_id').exec(function (err, user) {
    if (!user) return res.json({
      status: 404,
      message: 'Invalid email and/or password'
    });
  })
};


function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, process.env.TOKEN_SECRET);
}

exports.userForgotPassword = (req, res, next) => {

        crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');
        })
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return next({
                message: 'No account with that email address exists.'
            });
        user.resetPasswordToken = token;
        user.passwordExpiry = Date.now() + 3600000; // 1 hour
        
        mailForgotPassword(user);
        user.save(function (err) {
            if (err) return next({
                message: "Something went wrong",
                error: err
            });
            res.json({
                message: "Email send",
                status: 200
            });
        });
    });
};

exports.userResetPassword = (req, res, next) => {
  User.findOne({ resetPasswordToken: req.params.token, passwordExpiry: { $gt: Date.now() }}, function (err, user) {
    if (!user) return next({
      message: 'Password reset token is invalid or has expired.'
    });
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    mailResetPassword(user);

    user.save(function (err) {
      if (err) return next({
        message: "Something went wrong",
        error: err
      });
      res.json({
        message: "Success! Your password has been changed.",
        status: 200
      });
    });
  });
};
