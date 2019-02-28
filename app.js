var express = require('express');
var path = require('path');
var cors = require('cors')
const mongoose = require('mongoose');

let db_connection = 'mongodb://eventreview123:eventreview123@eventreview-shard-00-00-ybagi.mongodb.net:27017,eventreview-shard-00-01-ybagi.mongodb.net:27017,eventreview-shard-00-02-ybagi.mongodb.net:27017/test?ssl=true&replicaSet=eventreview-shard-0&authSource=admin&retryWrites=true'
if(process.env.NODE_ENV == 'test') {
    db_connection = 'mongodb://localhost/ereviewd-test'
}
mongoose.connect(db_connection);
// mongoose.connect('mongodb://localhost:27017/FinalProject-test', {useNewUrlParser: true});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var promotorRouter = require('./routes/promotor');
var eventRouter = require('./routes/event');
var beforeEventRouter = require('./routes/beforeEvent');
var afterEventRouter = require('./routes/afterEvent');

var app = express();

require('dotenv').config()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/promotors', promotorRouter);
app.use('/events', eventRouter);
app.use('/beforeEvent', beforeEventRouter);
app.use('/afterEvent', afterEventRouter);

module.exports = app;
