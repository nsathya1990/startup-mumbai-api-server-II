
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.headers.authorization) {
      var token = req.headers.authorization.split(' ')[1];
      try {
        var decoded = jwt.decode(token, tokenSecret);
        if (decoded.exp <= Date.now()) {
          res.json({
              status:400, 
              message:'Access token has expired'
            });
        } else {
          req.user = decoded.user;
          return next();
        }
      } catch (err) {
        return res.json({
            status:500, 
            message:'Error parsing token'});
      }
    } else {
      return res.json({
          status:401
        });
    }
  }
