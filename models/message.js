var mongo = require('mongoose');

var messageSchema = new mongo.Schema({
   	text: String,
   	name: String,
   	date: { type: Date, default: Date.now }
});

module.exports = mongo.model('Message', messageSchema);

exports.schema = messageSchema;