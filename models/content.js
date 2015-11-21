var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	text: String
});

mongoose.model('contents', contentSchema);
