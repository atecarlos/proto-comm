var mongo = require('mongoose');

var messageSchema = new mongo.Schema({
   	content: String,
   	username: String,
   	timestamp: { type: Date, default: Date.now }
});

module.exports = mongo.model('Message', messageSchema);

exports.schema = messageSchema;