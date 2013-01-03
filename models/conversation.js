var mongo = require('mongoose'),
	message = require('./message');

var schema = new mongo.Schema({
	topic: String,
   	createdBy : String,
   	timestamp: { type: Date, default: Date.now },
	messages: [message.schema]
});

schema.virtual('lastMessages').get(function(){
	var sortedMessages = this.messages.sort(function(a,b){
		return b.timestamp < a.timestamp;
	});

	return sortedMessages.slice(-2);
});

module.exports = mongo.model('Conversation', schema);

exports.schema = schema;

