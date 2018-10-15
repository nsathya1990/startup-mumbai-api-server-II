const user = require('../models/user');
const jwt = require('jwt-simple');


exports.postLoginUser = (req, res ,next) =>{
    user.findOne({ email: req.body.email }, function(err, user) {
      if (!user) return res.json({
        status:401,
        message: 'User does not exist'
      });
      else
     res.json({
         message: "username"
     })
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.json({
          status:401,
          message: 'Invalid email and/or password'
        });
        else
        res.json({
            message: "password"
        });
        var token = createJwtToken(user);
        res.json({ token: token });
      });
    });
  };
   
 exports.postChangePassword = (req, res ,next) =>{
   
 }


  
  function createJwtToken(user) {
    var payload = {
      user: user,
      iat: new Date().getTime(),
      exp: moment().add('days', 7).valueOf()
    };
    return jwt.encode(payload, config.tokenSecret);
  }

  exports.postFaceBooklogin =  (req, res ,next) =>{

  }