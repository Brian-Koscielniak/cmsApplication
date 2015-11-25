var session = require('express-session');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var Jade = require('jade');
var fs = require('fs');

module.exports = function(){
	var app = express();
	app.set('views', './views');
	app.set('view engine','jade');
	app.engine('jade', Jade.__express);
	app.use(express.static('public'));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(session({
		secret: 'taco cat',
		resave: false,
		saveUninitialized: false
	}));
	require('../routes/routes.js')(app);
	return app
}
