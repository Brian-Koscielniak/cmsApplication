module.exports = function(){
	// The modules and such
	var session = require('express-session');
	var express = require('express');
	var request = require('request');
	var bodyParser = require('body-parser');
	var Jade = require('jade');
	var fs = require('fs');

	// app is express
	var app = express();

	// setting all this noise
	app.set('views', __dirname + '/views');
	app.set('view engine','jade');
	app.engine('jade', Jade.__express);
	app.use(express.static('public'));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
}
