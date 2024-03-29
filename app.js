var express = require('express');
require('dotenv').config();
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var eventsRouter = require('./routes/events');
var venuesRouter = require('./routes/venues');

var app = express();
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/events', eventsRouter);
app.use('/venues', venuesRouter);

module.exports = app;
