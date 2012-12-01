var mongo = require('mongoose');

var schema = new mongo.Schema({
   	conversationId: mongo.Schema.Types.ObjectId,
   	userId: Number,
   	count: Number,
});

module.exports = mongo.model('UnreadMarker', schema);