var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')

var routes = require('./routes/index');
var users = require('./routes/users');
var travel= require('./routes/travel');
var ping = require('./routes/ping');
var rest = require('./routes/rest');
var connect = require('./models')().connection

var config = require('./keys.js')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var connection = connect();

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});


// config
passport.use(new FacebookStrategy({
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: config.facebook.callbackURL,
profileFields: ['name', 'email', 'displayName','link','photos'],
  profile: true

},
function(accessToken, refreshToken, profile, done) {

   process.nextTick(function () {
    var myQuery = 'SELECT * FROM users WHERE email = ?';
    // console.log('This is photo')
      var object;

    connection.query(myQuery,[profile.emails[0].value], function(error, row) {
      if(error)
        throw error;
      // console.log(row);

      if(row.length == 0) {
        myQuery = 'INSERT INTO users (name, email, avatar) VALUES (? , ?, ?)';
        console.log();
        var photo = null;
        if(profile.photos) {
          photo = profile.photos[0].value
        }
        connection.query(myQuery,[profile.displayName,profile.emails[0].value, photo], function(error, row) {
          console.log(row);
          object = {id: row.insertId, avatar: photo, email: profile.emails[0].value, name: profile.displayName };

        });
      }
      else {
        object = row[0];
      }
      return done(null, object);


    });
    // console.log(a);
 });

}
));

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
  profile: true

},
function(accessToken, refreshToken, profile, done) {

   process.nextTick(function () {
    var myQuery = 'SELECT * FROM users WHERE email = ?';
    // console.log('This is photo')
      var object;
      console.log(profile);

    connection.query(myQuery,[profile.emails[0].value], function(error, row) {
      if(error)
        throw error;
      // console.log(row);

      if(row.length == 0) {
        myQuery = 'INSERT INTO users (name, email, avatar) VALUES (? , ?, ?)';
        console.log();
        var photo = null;
        if(profile.photos) {
          photo = profile.photos[0].value
        }
        connection.query(myQuery,[profile.displayName,profile.emails[0].value, photo], function(error, row) {
          console.log(row);
          object = {id: row.insertId, avatar: photo, email: profile.emails[0].value, name: profile.displayName };

        });
      }
      else {
        object = row[0];
      }
      return done(null, object);


    });
    // console.log(a);
 });

}
));


var app = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});
app.connection = connection;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: config.session.secret,
   resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));



app.use('/users', users);
// app.use('/travel',travel);

app.use('/api/v1', rest);
app.get('/dashboard', ensureAuthenticated, function(req, res){
  // res.send(req.user);
res.render('dashboard', { user: req.user });
});


app.get('/', notAuthenticated, function(req, res){
res.render('index', { user: req.user });
});

app.get('/auth/facebook',notAuthenticated,
passport.authenticate('facebook',{scope: 'email'}),
function(req, res){
  console.log(res);
});
app.get('/auth/facebook/callback'
,passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
  console.log('logging stuff');
  // console.log(res);
 res.redirect('/dashboard');
});

app.get('/auth/google',notAuthenticated,
passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }),
function(req, res){
  console.log(res);
});
app.get('/auth/google/callback'
,passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
  console.log('logging stuff');
  // console.log(res);
  // res.send(req.user);
 res.redirect('/dashboard');
});
app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

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

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hack'
});
connection.connect();
app.connection=connection;

function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}
function notAuthenticated(req, res, next) {
if (!req.isAuthenticated()) { return next(); }
res.redirect('/dashboard')
}


module.exports = app;