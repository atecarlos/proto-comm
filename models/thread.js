var mongo = require('mongoose'),
	message = require('./message');

var threadSchema = new mongo.Schema({
	title: String,
	messages: [message.schema]
});

module.exports = mongo.model('Thread', threadSchema);

exports.schema = threadSchema;