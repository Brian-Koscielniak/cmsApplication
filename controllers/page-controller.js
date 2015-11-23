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
						if(admin){
							res.render("pageTemplate.jade", {page: Page, admin: true, pageData: item.content});
						}else{
							res.render("pageTemplate.jade", {page: Page, admin: false, pageData: item.content});
						}
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
