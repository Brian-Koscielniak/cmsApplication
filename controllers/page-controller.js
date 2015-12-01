var fs = require('fs');

exports.renderPage = function(Page, res, admin){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('pageContent', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.find({page: Page}, function(err, cursor){
					cursor.forEach(function(item){
						getServiceTimes(function(timeList){
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
				getServiceTimes(function(timeList){	
					getFileData(function(fileData){
						res.render("sermons.jade", {admin: admin, page: "sermons", services: timeList, filedb: fileData})
					})
				})
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
						console.log(err);
					} else {
						db.close();
					}
				});
				collection.update({service: 2},{$set:{time: times[1]}},{multi:true, w:1},function(err, results){
					if (err){
						console.log(err);
					} else {
						db.close();
					}
				});
			}
		});
		res.send(req.body.data);
	});
};

exports.handlePostFiles = function(upload, req, res){
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
		  if (err) {
		  	console.log(err)
		  } else{
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
								getServiceTimes(function(timeList){	
									getFileData(function(fileData){
										res.send(fileData);
									})
								})
							}
						});
					}
				});
			});
		  }
	 });
};

exports.deleteFile = function(req, res){
	var MongoClient = require('mongodb').MongoClient
	MongoClient.connect('mongodb://localhost:27017/content', function(err, db){
		db.collection('files', function(err, collection){
			if(err){
				console.log(err);
			} else {
				collection.findOneAndDelete({_id: req.body.data},function(err, results){
					if (err){
						console.log(error);
					} else {
						fs.unlink(("./public/files/"+req.body.data+".pdf"), function(err){
							getFileData(function(fileData){
								if(fileData != null){
									res.send(fileData);
								} else {
								/* Client side scripts will try to parse the response as JSON, unless 
								false. Sending nothing is not optional as it expects a response */
									res.send(false);
								}
							});
						});
						db.close();
					}
				});
			}
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
