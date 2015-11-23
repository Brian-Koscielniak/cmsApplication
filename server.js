/*
// TODO: get app.js  to work and import like it should
	// The modules and such
	var session = require('express-session');
	var express = require('express');
	var request = require('request');
	var bodyParser = require('body-parser');
	var Jade = require('jade');
	var fs = require('fs');
	var crypto = require('crypto');
	var controller = require('./controllers/page-controller.js'); //TODO Move to routes.js

	// app is express
	var app = express();

	// TODO: For reasons I have yet to understand, everything goes janky when I relocate routes
	// require('./routes/routes.js')(app);

	// setting all this noise
	app.set('views', __dirname + '/views');
	app.set('view engine','jade');
	app.engine('jade', Jade.__express);
	app.use(express.static('public'));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
*/

// Unless specified otherwide, server runs on port 3000
var express = require('./config/express');
var mongoose = require('./config/mongoose');

var app = express();

process.argv[2] ? port = process.argv[2] : port = 3000;
app.listen(port, function(){
	console.log('Server is running on port %d', port);
});

module.exports = app;

/////////////passwords///////////
/*
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}
*/

// 
/*
app.use(session({
  secret: 'taco cat',
  resave: false,
  saveUninitialized: false
}));
*/

















// Setting up routes
/*
app.get('/logout', function(req, res){
	req.session.destroy(function(){
		res.redirect('/login');
	});
});

app.get('/login', function(req, res){
	if(req.session.user){
		res.redirect('/home');
	} else if (req.session.error){
		error = req.session.error;
		res.render('login.jade',{data: {error: error}})
	} else {
		error = '';
		res.render('login.jade',{data: {error: error}});
	}
});

app.post('/login', function(req, res){
	//user should be a lookup of req.body.username in database
	var user = {name:req.body.username, password:hashPW("myPass")};
	if (user.password === hashPW(req.body.password.toString())) {
		req.session.regenerate(function(){
			req.session.user = user;
			req.session.success = 'Authenticated as ' + user.name;
			req.session.admin = true;
			res.redirect('/home');
		});
	} else {
		req.session.regenerate(function(){
			req.session.error = 'Authentication failed.';
			res.redirect('/login');
		});
	}
});

app.get('/sermons', function(req, res){
	res.render("sermons.jade");
});

app.get('/', function(req, res){
	res.redirect('/home');
});
app.get('*', function(req, res){
	// Access the http request object, to TODO finish this comment
	var path = req._parsedOriginalUrl.path.slice(1)

	// Check for admin status, and render page based on path variable
	req.session.admin ? controller.renderPage(path, res, req.session.admin) : controller.renderPage(path, res, false);
});
app.post("*", function(req, res){
	// Access the http request object, to TODO finish this comment
	var path = req._parsedOriginalUrl.path.slice(1)

	controller.handlePost(path, res, req);
});
*/
