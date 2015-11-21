var config = require('./config');
var express = require('express');
var jade = require('jade');

module.exports = function(){
	var app = express();
	app.set('views', './views');
	app.set('view engine', 'jade');
	app.use(express.static('public'));
	app.engine('jade', jade.__express);
	require('../routes/routes.js')(app);
	return app
}
