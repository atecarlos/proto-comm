var mongo = require('mongoose'),
	message = require('./message');

var schema = new mongo.Schema({
	topic: String,
   	createdBy : String,
   	timestamp: { type: Date, default: Date.now },
	messages: [message.schema]
});

module.exports = mongo.model('Conversation', schema);

exports.schema = schema;

