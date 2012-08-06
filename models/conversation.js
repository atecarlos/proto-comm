var mongo = require('mongoose'),
	Thread = require('./thread');

var conversationSchema = new mongo.Schema({
   	topic: String,
   	threads: [Thread.schema],
});

conversationSchema.virtual('mainThread')
	.get(function() { return this._mainThread[0]; });

conversationSchema.pre('save', function(next){
	if(this.threads.length == 0){
		this.threads.push(new Thread());
	}
	next();
});

module.exports = mongo.model('Conversation', conversationSchema);