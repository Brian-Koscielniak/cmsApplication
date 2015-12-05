var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	page: String,
	content: String
});

// look for pageContent collection
mongoose.model('pagecontents', contentSchema);
