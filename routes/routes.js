var controller = require('../controllers/page-controller.js');
var crypto = require('crypto');
var multer = require('multer');
var fs = require('fs');

module.exports = function(app){
	// GETs
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

	app.get('/', function(req, res){
		res.redirect('/home');
	});

	app.get('/sermons', function(req, res){
		// Check for admin status, and render page based on path variable
		req.session.admin ? controller.renderSermons(res, req.session.admin) : controller.renderSermons(res, false);
	});

	app.get('/public/files/*', function(req, res){ 
		// Access the http request object to find dynamic path
		var filePath = req._parsedOriginalUrl.path.slice(1)
		
		// Read and send the file. 
		fs.readFile(filePath, function (err,data){
			res.contentType("application/pdf");
			res.send(data);
		});
	});

	app.get('*', function(req, res){
	// Becuase most pages are very similar, 'one' route will do just fine if content is feed in appropriately 
		// Access the http request object to find dynamic path
		var Path = req._parsedOriginalUrl.path.slice(1)

		// Check for admin status, and render page based on path variable
		req.session.admin ? controller.renderPage(Path, res, req.session.admin) : controller.renderPage(Path, res, false);
	});


	// POSTs 
	app.post('/login', function(req, res){
		//user should be a lookup of req.body.username in database
		var user = {name:req.body.username, password:hashPW("p")};
		if (user.password === hashPW(req.body.password.toString())) {
			req.session.regenerate(function(){
				//req.session.user = user;
				//req.session.success = 'Authenticated as ' + user.name;
				req.session.admin = true;
				res.redirect('/home');
			});
		} else {
			req.session.regenerate(function(){
				req.session.error = 'Incorrect Password.';
				res.redirect('/login');
			});
		}
	});

	app.post("/times", function(req, res){
		controller.handlePostTimes(res, req);
	});

	var upload = multer({dest: './public/files' });
	app.post('/sermons', upload.single('file'), function(req, res){
		controller.handlePostFiles(upload, req, res);
	});
	
	app.post('/delete', function(req, res){
		controller.deleteFile(req, res);
	});

	app.post("*", function(req, res){
		// Access the http request object to find dynamic path
		var Path = req._parsedOriginalUrl.path.slice(1)

		controller.handlePost(Path, res, req);
	});
};

function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

