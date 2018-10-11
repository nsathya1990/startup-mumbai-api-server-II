const user = require('../models/user');
const jwt = require('jwt-simple');

exports.postLoginUser = (req, res ,next) =>{
    user.findOne({ email: req.body.email }, function(err, user) {
      if (!user) return res.send(401, 'User does not exist');
      else
     res.json({
         message: "username"
     })
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.send(401, 'Invalid email and/or password');
        else
        res.json({
            message: "password"
        });
        var token = createJwtToken(user);
        res.send({ token: token });
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