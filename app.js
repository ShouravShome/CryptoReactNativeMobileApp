var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const options = require("./knexfile");
const knex = require("knex")(options);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const { version } = require('os');
const cors = require("cors")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", apiRouter);

app.get("/knex", function(req, res, next){
  let query = "SELECT VERSION();"
  req.db.raw("SELECT VERSION()")
    .then(version => console.log(version[0][0])).catch(err => {console.log(err);throw err});
    res.send("Version successful")
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
