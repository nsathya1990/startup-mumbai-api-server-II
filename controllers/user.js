const User = require('../models/user');
const jwt = require('jwt-simple');
const moment = require('moment');

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

