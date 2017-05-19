var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//连接数据库
global.dbHandle = require('./models/dbHandle');
global.db = mongoose.connect('mongodb://localhost:27017/nodedb');

//设置session
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user; //从session获取user对象
    var err = req.session.error; //获取错误信息
    delete req.session.error;
    res.locals.message = ""; //展示的信息message
    if(err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'
            + err + '</div>'
    }
    next(); //中间件传递
});

//配置路由
app.use('/', routes);
app.use('/users', users);
app.use('/login', routes);
app.use('/register', routes);
app.use('/home', routes);
app.use('/logout', routes);

// view engine setup
//设置模板引擎为html
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
