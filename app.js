var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var myConnection = require('express-myconnection');

var app = express();
app.use(cors());
app.use(express.static('public'));
// get request parametters
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var book = require('./routes/book');
var users = require('./routes/users');
var fee = require('./routes/fee');
var notice = require('./routes/notice');
var notiFcm = require('./routes/fcm');
var notiList = require('./routes/notiList');
var upload = require('./routes/upload');
var request = require('./routes/request');
var post = require('./routes/post');
var email = require('./routes/email');

// Config DB
var config = require('./../share/config');
var dbOptions = {
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	database: config.database.db
};
app.use(myConnection(mysql, dbOptions, 'pool'));

var expressValidator = require('express-validator');
app.use(expressValidator());

var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 60000
	}
}));
app.use(flash());
app.use('/users', users);
app.use('/book', book);
app.use('/fee', fee);
app.use('/notice', notice);
app.use('/notiList', notiList);
app.use('/fcm', notiFcm);
app.use('/upload', upload);
app.use('/request', request);
app.use('/post', post);
app.use('/email', email);
app.listen(3000, function () {
	console.log('Server running at port 3000: http://127.0.0.1:3000');
});