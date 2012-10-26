var mongo = require('mongoose');

var schema = new mongo.Schema({
	strip: [{ type: mongo.Schema.Types.ObjectId, ref:'Conversation' }],
	active: [{ type: mongo.Schema.Types.ObjectId, ref:'Conversation' }],
	userId: Number,
});

module.exports = mongo.model('Desktop', schema);

exports.schema = schema;