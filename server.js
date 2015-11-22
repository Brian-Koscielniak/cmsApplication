// TODO: get app.js  to work and import like it should
	// The modules and such
	var session = require('express-session');
	var express = require('express');
	var request = require('request');
	var bodyParser = require('body-parser');
	var Jade = require('jade');
	var fs = require('fs');
	var crypto = require('crypto');

	// app is express
	var app = express();

	// setting all this noise
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

/////////////passwords///////////
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}

// 
app.use(session({
  secret: 'taco cat',
  resave: false,
  saveUninitialized: false
}));
////////////////////////////////////////

// Setting up routes
app.get('/', function(req, res){
      res.redirect('/home');
});

app.get('/home', function(req, res){
	if (req.session.admin){
		renderPage("home", res, req.session.admin);
	} else {
		renderPage("home", res, false);
	}
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

	
function renderPage(Page, res, admin){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.find({page: Page}, function(err, cursor){
					cursor.forEach(function(item){
						if(admin){
							res.render(Page, {admin: true, pageData: item.content});
						}else{
							res.render(Page, {admin: false, pageData: item.content});
						}
						db.close();
					});
				});
			}
		});
	});
}

app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

app.get('/login', function(req, res){
  if(req.session.user){
    res.redirect('/restricted');
  }else if(req.session.error){
    error = req.session.error;
    res.render('login.jade',{data: {error: error}})
   
  }
  else{
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
  } 
  else {
    req.session.regenerate(function(){
      req.session.error = 'Authentication failed.';
      res.redirect('/login');
    });
  }
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

