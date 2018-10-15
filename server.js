/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const async = require('async');

dotenv.load({ path: '.env' });

const passportConfig = require('./config/authentication');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

/**
 * Controllers (route handlers).
 */
const apiController = require('./controllers/api');
const userController = require('./controllers/user');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGO_URL, {
  auth: {
    user: process.env.MONGO_DB_USER,
    password: process.env.MONGO_DB_PASSWORD
  }
})
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
mongoose.connection.on('open', () => {
  console.log('%s MongoDB connected successful', chalk.green('✓'));
});

//passport initialize
app.use(passport.initialize());

/**
 * Express configuration.
 */
app.set('host', process.env.NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use((req, res, next) => {
//   if (req.path === '/api/upload') {
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//   }
// });

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.post('/api/login', userController.postLoginUser);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/api/newPage',
    failureRedirect: '/api/login'
  }));
app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/login' }),
  function (req, res) {
    res.redirect('/');
  });
 


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
