var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = new Schema({
	service: String,
	time: String
});

mongoose.model('services', serviceSchema);
