var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersTest = new Schema({
	name: String
});

mongoose.model('users', usersTest);
