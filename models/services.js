var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = new Schema({
	service: String,
	time: String
});

// look for pageContent collection
mongoose.model('services', serviceSchema);
