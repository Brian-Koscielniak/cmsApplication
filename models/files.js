var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
	_id: String,
	date: String,
	name: String,
	path: String
});

// look for pageContent collection
mongoose.model('files', fileSchema);
