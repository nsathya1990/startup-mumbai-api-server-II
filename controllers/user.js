const user = require('../models/user');
const jwt = require('jwt-simple');

exports.postLoginUser = (req, res ,next) =>{
    user.findOne({ email: req.body.email }, function(err, user) {
      if (!user) return res.json(401, 'User does not exist');
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.json(401, 'Invalid email and/or password');
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