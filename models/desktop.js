var mongo = require('mongoose');

var schema = new mongo.Schema({
	conversations: [ mongo.Schema.Types.ObjectId ],
	userId: Number,
});

schema.methods.removeConversation = function(conversationId){
	var index = this.conversations.indexOf(conversationId);
	if(index >= 0){		
		this.conversations.splice(index, 1);
	}
}

schema.statics.findOrCreateByUserId = function(userId, callback){
	var model = this;

	this.findOne({ userId: userId }, function(err, desktop){
		if(desktop === null){
			desktop = new model();
			desktop.userId = userId;
			desktop.save(callback);
		}
		else{
			callback(err, desktop);
		}
	});
}

module.exports = mongo.model('Desktop', schema);

exports.schema = schema;