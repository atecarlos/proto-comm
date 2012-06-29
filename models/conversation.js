var mongo = require('mongoose'),
	message = require('./message');

var conversationSchema = new mongo.Schema({
   	topic: String,
   	messages: [message.schema],
});

module.exports = mongo.model('Conversation', conversationSchema);