var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var paypal = require('paypal-rest-sdk');
var nconf = require('nconf');

var events = require('./routes/events');

// configure PP
nconf.argv().env().file({ file: 'config.json' });
var ppClientId = nconf.get('clientId') || "";
var ppClientSecret = nconf.get('clientSecret') || "";
var ppEnv = nconf.get('env') || 'sandbox';

console.log("Using PayPal %s environment (Client ID %s, Client Secret %s)", ppEnv, ppClientId.substr(0,5) + "…", ppClientSecret.substr(0,5) + "…");

paypal.configure({
  'mode': ppEnv,
  'client_id': ppClientId, // 'Aa7qc7-m--R7QneInwJhGt42ClRmBPYwW_XFUYu0symzeN5uUbrp1HPz0CML2qfoF1aBAXQnOqOxQVDb',
  'client_secret': ppClientSecret, // 'EDnn3waNkVymg9tPeMaUrgfE99WDMCPYQcWd0L0vNm16KMFz82MK8IZCJwIvjsKk-OSiteRdGXL1e6s3',
  'headers' : {
    'custom': 'header'
  }
});

// App setup
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
