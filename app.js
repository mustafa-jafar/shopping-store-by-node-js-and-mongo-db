var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose =require('mongoose');
const expressSession = require('express-session');
const bycrpt = require('bcrypt');
const flash = require('connect-flash');
const passPort = require('passport');
const expressHbs = require('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();
// conect to database

mongoose.connect('mongodb://localhost/shoping' , {useUnifiedTopology : true , useNewUrlParser: true } ,(err)=>{
  if(err){
    console.log(err);
  }
  console.log('connect to db')
});
require('./confg/passport');
// view engine setup
app.engine('.hbs' , expressHbs({defaultLayout : 'layout' , extname : '.hbs' ,helpers :{
  add: function(v){
    return v+1;
  },
  checkquntaty : function(value){
    if(value<=1){
      return true ;
    }else{
      return false ;
    }
  }
} }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret : 'shoping',
  saveUninitialized : false,
  resave : true,
}));
app.use(flash());
app.use(passPort.initialize());
app.use(passPort.session()) ;
app.use(expressSession({secret: 'do', saveUninitialized : false , resave : false}));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
