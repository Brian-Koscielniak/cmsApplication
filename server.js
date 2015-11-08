var Express = require('express');
var Jade = require('jade');

var app = Express();

app.set('views', __dirname + '/views');
app.set('view engine','jade');
app.engine('jade', Jade.__express);
app.use(Express.static('public'));

// Unless specified otherwide, server runs on port 3000
process.argv[2] ? port = process.argv[2] : port = 3000;

app.listen(port);
console.log('Server is running on port %d', port);

// Setting up routes
app.get('/', function(req, res){
	res.render("home.jade");
});

app.get('/home', function(req, res){
	res.render("home.jade");
});

app.get('/sermons', function(req, res){
	res.render("sermons.jade");
});

app.get('/ministry', function(req, res){
	res.render("ministry.jade");
});

app.get('/community', function(req, res){
	res.render("community.jade");
});

app.get('/events', function(req, res){
	res.render("events.jade");
});

app.get('/about', function(req, res){
	res.render("about.jade");
});

app.get('*', function(req, res){
	res.send("Nothing Here");
});
