var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
	_id: String,
	date: String,
	name: String,
	path: String
});

mongoose.model('files', fileSchema);
