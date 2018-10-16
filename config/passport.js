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
