var express = require('./config/express');
var mongoose = require('./config/mongoose');

var app = express();

// Unless specified otherwide, server runs on port 3000
process.argv[2] ? port = process.argv[2] : port = 3000;
app.listen(port, function(){
	console.log('Server is running on port %d', port);
});

module.exports = app;
