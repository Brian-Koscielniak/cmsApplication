var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var Jade = require('jade');
var fs = require('fs');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine','jade');
app.engine('jade', Jade.__express);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Unless specified otherwide, server runs on port 3000
process.argv[2] ? port = process.argv[2] : port = 3000;

app.listen(port);
console.log('Server is running on port %d', port);

// Setting up routes
app.get('/', function(req, res){
	renderPage("home", res)
});

app.get('/home', function(req, res){
	renderPage("home", res)
});

app.post("/home", function(req, res){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.update({},{$set:{content: req.body.data}},{multi:true, w:1},function(err, results){
					if (err){
						console.log(error);
					} else {
						db.close();
					}
				});
			}
		});
		res.send(req.body.data);
	});
});

	
function renderPage(Page, res){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.find({page: Page}, function(err, cursor){
					cursor.forEach(function(item){
						res.render(Page, {pageData: item.content});
						db.close();
					});
				});
			}
		});
	});
}
//////////////////////////////////////////
var MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
	/*
	var contentDB = db;
	contentDB.createCollection("pageContent", function(err, newCollection){
		newCollection.insert({test: "text"});
	});
	*/
});


/////////////////////////////////////////
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

