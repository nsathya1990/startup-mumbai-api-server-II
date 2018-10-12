const user = require('../models/user');
const jwt = require('jwt-simple');

;

exports.postLoginUser = (req, res ,next) =>{
    user.findOne({ email: req.body.email }, function(err, user) {
<<<<<<< HEAD
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
=======
      if (!user) return res.json(401, 'User does not exist');
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.json(401, 'Invalid email and/or password');
>>>>>>> 0cdbf06cf5ad1df6e837c57d64e9b0ed24d3e180
        var token = createJwtToken(user);
        res.json({ token: token });
      });
    });
  };
   
 


  
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