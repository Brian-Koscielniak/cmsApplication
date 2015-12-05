var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/content')

// Load in all the mongoose models
fs.readdirSync(__dirname + '/../models').forEach(function(filename) {
	if (~filename.indexOf('.js')){require(__dirname + '/../models/' + filename)}
});

exports.renderPage = function(Page, res, admin){
	mongoose.model('pagecontents').find({page:Page},function(err, pageData){
		if(err){
			console.log(err);
		} else {
			if(!pageData[0]){
			// 'Page' variable can be anything, but only certain entries exist in the database. if 'Page' isn't found then 404
				res.send("There is nothing here.");
			} else {
				// Every page gets service times. 
				getServiceTimes(function(timeList){
					// Render that page passing in the correct information, on gerServiceTimes success.
					res.render("pageTemplate.jade", {page: Page, admin: admin, pageData: pageData[0].content, services: timeList});
				});
			}
		};
	});
};

exports.renderSermons = function(res, admin){
// Sermons page is a unique page from the rest, it gets it's own controller
	// Every page gets service times. 
	getServiceTimes(function(timeList){	
		// get Sermons files
		getFileData(function(fileData){
			// Render the page passing in information
			res.render("sermons.jade", {admin: admin, page: "sermons", services: timeList, filedb: fileData})
		})
	})
};

exports.handlePost = function(Page, res, req){
	mongoose.model('pagecontents').find({page:Page},function(err, pageData){
		if(err){
			console.log(err);
		} else {
			// Update 'Page' content data 
			pageData[0].content = req.body.data;
		
			// ...and save
			pageData[0].save(function(err){
				if(err){
					console.log(err);
				}else{
					// Send the data back, so the UI can be updated
					res.send(req.body.data);
				}
			});
		}
	});
};

exports.handlePostTimes = function(res, req){
	// Break the string sent on post into two entries so they can be saved separately 
	var times = req.body.data.split("^^^")

	// Do the model thing
	mongoose.model('services').find({},function(err, services){
		if(err){
			console.log(err);
		} else {
			// Update
			services[0].time = times[0];
			services[1].time = times[1];
			
			// And save
			services[0].save();
			services[1].save();
		}
		res.send(req.body.data);
	});
};

exports.handlePostFiles = function(upload, req, res){
	function getDate(){
	// Build a human friendly date from the javascript Date object
		var d = "";
		var date = new Date();
		var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
		d = days[date.getDay()] + " ";
		d += months[date.getMonth()] + " "; 
		d += date.getDate() + " "; 
		d += date.getFullYear(); 
		return d;
	}
	var mainPath = 'public/files/';
	fs.rename(mainPath + req.file.filename, mainPath + req.file.filename + '.pdf', function (err) {
		if (err) {
			console.log(err)
		} else {
			var d = getDate();
			var File  = mongoose.model('files')
			
			// Create new file entry based on the mongoose model files
			var newFile = File({
				_id: req.file.filename,
				date: d, 
				name: req.body.data,
				path: mainPath+req.file.filename+".pdf"
			});
		
			// Save it.
			newFile.save(function(err){
				if (err) {
					console.log(err)
				} else {
					// Async style resent file data
					getFileData(function(fileData){
						res.send(fileData);
					})
				}
			});
		}
	});
}

exports.deleteFile = function(req, res){
	// Remove the entry for the database, by finding it's unique id, that was stored in the HTML element 
	mongoose.model('files').findOneAndRemove({_id: req.body.data},function(err, file){
		// Make the copy of the file 'go away'
		fs.unlink(("./public/files/"+req.body.data+".pdf"), function(err){
			getFileData(function(fileData){
				if(fileData != null){
				// Unless all records are deletes, send what's there
					res.send(fileData);
				} else {
				/* Client side scripts will try to parse the response as JSON, unless 
				false. Sending nothing is not optional as it expects a response */
					res.send(false);
				}
			});
		});
	});
};

function getServiceTimes(callback){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('services', function(err, collection){
			if(err){
				console.log(err);
			} else {
				var timeList = [];
				var i = 0;
				var Count;
				collection.find({}, function(err, cursor){
					cursor.count(function(err, count){
						count ? Count = count : callback(null)
					})
					cursor.forEach(function(item){
						timeList.push(item.time);
						i++
						db.close();
						if(i == Count){callback(timeList)}
					});
				});
			}
		})
	})
}

function getFileData(callback){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('files', function(err, collection){
			if(err){
				console.log(err);
			} else {
				var fileData = [];
				var i = 0;
				var Count;
				collection.find({}, function(err, cursor){
					cursor.count(function(err, count){
						count ? Count = count : callback(null)
					})
					cursor.forEach(function(item){
						fileData[i] = item;
						i++;
						db.close();
						if(i == Count){callback(fileData)}
					});
				});
			}
		})
	})
}
