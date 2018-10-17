const User = require('../models/user');
const jwt = require('jwt-simple');
const moment = require('moment');

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

exports.postChangePassword = (req, res) => {
  console.log(req.user)
  User.findOne({ _id: req.user.id }).select('password').exec(function (err, user) {
    console.log("Inside mongoose");
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
    }
  )
  })

}

exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user.id }).select('-_id').exec(function (err, user) {
    if (!user) return res.json({
      status: 404,
      message: 'Invalid email and/or password'
    });
  })
};


exports.postStatus = (req, res) => {
  console.log("inside postStatus()");
  User.findOne({ _id: req.user.id }).select('status').exec(function (err, user){
    if (err) {
      console.log("inside err()");
      throw err
    }
    if(user){
      console.log("inside user()");
      if(typeof user.profileType !== 'undefined')
      {
        var isComplete = false;
        user.profileType.map(function(profile){
          if(typeof user[profile] != 'undefined' && user[profile].status == 'complete')
          {
            isComplete = true;
          } 
        })
        if(isComplete)
        {
          console.log("inside isComplete()");
          res.json({
            status:200,
            message:'Status Complete',
            data: user.profileType
          })
        }
        else{
          console.log("inside isComplete else()");
          res.json({
            status:404,
            message:'incomplete status'
          })
        }
      }
    }
    else{
      console.log("inside last else()");
      res.json({
        status:404,
        message:'user not there'
      })
    }
  })
}

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, process.env.TOKEN_SECRET);
}

