var mongo = require('mongoose'),
	Thread = require('./thread');

var conversationSchema = new mongo.Schema({
   	threads: [Thread.schema],
});

conversationSchema.virtual('mainThread')
	.get(function() { return this._mainThread[0]; });

module.exports = mongo.model('Conversation', conversationSchema);