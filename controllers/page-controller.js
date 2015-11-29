var fs = require('fs');
var async = require('async');

/*
// This section is trying to get mongoose to do it's thing
var contents = require('../models/content');

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Content = mongoose.model('contents');

mongoose.connect('mongodb://127.0.0.1:27017/content');
mongoose.connection.on('open', function(){
	// 
});


fs.readdirSync(path.normalize(__dirname + '/../models')).forEach(function(filename){
	if(~filename.indexOf('js')){
		require(path.normalize(__dirname + '/../models/' + filename));
		console.log(path.normalize(__dirname + '/../models/' + filename));
	}
});


var test = mongoose.model('contents');
test.find(function(err, page){
	console.log(JSON.stringify(page));
});
*/


exports.renderPage = function(Page, res, admin){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.find({page: Page}, function(err, cursor){
					cursor.forEach(function(item){
						exports.getServices(function(timeList){
							res.render("pageTemplate.jade", {page: Page, admin: admin, pageData: item.content, services: timeList});
						});
						db.close();
					});
				});
			}
		});
	});
};

exports.renderSermons = function(res, admin){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('files', function(err, collection){
			if(err){
				console.log(err);
			} else {
				exports.getServices(function(timeList){	
					var filePaths = [];
					var fileNames = [];
					var fileDates = [];
					var fileData = [];
					collection.find({}, function(err, cursor){
						var i = 0;
						cursor.forEach(function(item){
							filePaths[i] = item.path;
							fileNames[i] = item.name;
							fileDates[i] = item.date;
							fileData[i] = {path: filePaths[i], name: fileNames[i], date: fileDates[i]};
							i++;
							db.close();
						});
				
						// Faking with Timeout. I can't seem to get the res.render to wait until the cursor.forEach is done.
						setTimeout(function(){res.render("sermons.jade", {admin: admin, page: "sermons", services: timeList, filedb: fileData})}, 1000);
					});
				});
			}
		});
	});
};

exports.handlePost = function(Page, res, req){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.update({page: Page},{$set:{content: req.body.data}},{multi:true, w:1},function(err, results){
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
};

exports.handlePostTimes = function(res, req){
	var times = req.body.data.split("^^^")
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('services', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.update({service: 1},{$set:{time: times[0]}},{multi:true, w:1},function(err, results){
					if (err){
						console.log(error);
					} else {
						db.close();
					}
				});
				collection.update({service: 2},{$set:{time: times[1]}},{multi:true, w:1},function(err, results){
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
};

exports.handlePostFiles = function(upload, res, req){
	var fileData = [];
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('files', function(err, collection){
			if(err){
				console.log(err);
			} else {
				exports.getServices(function(timeList){	
					var filePaths = [];
					var fileNames = [];
					var fileDates = [];
					collection.find({}, function(err, cursor){
						var i = 0;
						cursor.forEach(function(item){
							filePaths[i] = item.path;
							fileNames[i] = item.name;
							fileDates[i] = item.date;
							fileData[i] = {path: filePaths[i], name: fileNames[i], date: fileDates[i]};
							i++;
							db.close();
						});
					});
				});
			}
		});
	});
	function getDate(){
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
		var MongoClient = require('mongodb').MongoClient
		MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
			db.collection('files', function(err, collection){
				if(err){
					console.log(err);
				} else {
					var d = getDate();
					collection.update({_id: req.file.filename},{$set:{_id: req.file.filename, date: d, name: req.body.data, path: mainPath+req.file.filename+".pdf"}},{upsert: true, multi:true, w:1},function(err, results){
						if (err){
							console.log(error);
						} else {
							db.close();
							setTimeout(function(){res.send(fileData)},3000);
						}
					});
				}
			});
		});
	});
};

exports.getServices = function(callback){
/* This functions gets the service times one at a time. Callbacks are challenging... */
	var timeList = [];
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('services', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.find({service: 1}, function(err, cursor){
					cursor.forEach(function(item){
						timeList.push(item.time);	
						collection.find({service: 2}, function(err, cursor){
							cursor.forEach(function(item){
								timeList.push(item.time);
								db.close();
								callback(timeList);
							});
						});
					});
				});
			}
		});
	});
};
