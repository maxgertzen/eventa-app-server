var express = require('express');
require('dotenv').config();
var cors = require('cors');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var store = new session.MemoryStore();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var eventsRouter = require('./routes/events');

var app = express();
app.use(cors());
app.use(session({
    genid: function () {
        return require('crypto').randomBytes(48).toString('hex')
    },
    secret: 'some secret',
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    resave: true,
    store
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/events', eventsRouter);

module.exports = app;
