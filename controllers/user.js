const user = require('../models/user');
const jwt = require('jwt-simple');


exports.postLoginUser = (req, res ,next) =>{
    user.findOne({ email: req.body.email }, function(err, user) {
      if (!user) return res.json({
        status:404,
        message: 'Invalid email and/or password'
      });
  
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.json({
          status:404,
          message: 'Invalid email and/or password'
        });
    
        var token = createJwtToken({
          user:user.id
        });
        res.json({ 
          status: 200,
          message: 'Successful Login',
          token: token });
      });
    });
  };
   
exports.getMe = (req, res ,next) =>{
  user.findOne({ id: req.user.id }).select('-_id').exec( function(err, user) {
    if (!user) return res.json({
      status:404,
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
    return jwt.encode(payload, config.tokenSecret);
  }

