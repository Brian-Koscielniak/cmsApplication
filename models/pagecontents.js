var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	page: String,
	content: String
});

mongoose.model('pagecontents', contentSchema);
