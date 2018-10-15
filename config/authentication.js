const passport = require('passport'),
{ Strategy: FacebookStrategy } = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.find({ email: req.body.email }, function (err, user) {
            if (!user) return res.json({
                status: 401,
                message: 'User does not exist'
            }, function (err, user) {
                if (err) {
                    return res.json({
                        status: 401,
                        message: 'callback function'
                    });
                }
                done(null, user);
            });
        });
    }));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: "/auth/google/callback"
},
    function (token, tokenSecret, profile, done) {
        console.log('profile',profile);
        console.log(done);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

function ensureAuthenticated(req, res, next) {
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