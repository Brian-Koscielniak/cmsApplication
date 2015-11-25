require('../models/content');
var mongoose = require('mongoose');
var Content = mongoose.model('contents');

exports.renderPage = function(Page, res, admin){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.find({page: Page}, function(err, cursor){
					cursor.forEach(function(item){
						getServices(function(timeList){
							res.render("pageTemplate.jade", {page: Page, admin: admin, pageData: item.content, services: timeList});
						});
						db.close();
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

function getServices(callback){
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
