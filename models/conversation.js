var mongo = require('mongoose'),
	Thread = require('./thread');

var conversationSchema = new mongo.Schema({
   	threads: [Thread.schema],
});

module.exports = mongo.model('Conversation', conversationSchema);