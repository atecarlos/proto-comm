var mongo = require('mongoose');

var schema = new mongo.Schema({
   	elementId: mongo.Schema.Types.ObjectId,
   	unreadBy: [Number],
});

module.exports = mongo.model('Unread', schema);