var mongo = require('mongoose');

var messageSchema = new mongo.Schema({
   	content: String,
   	user: {
   		id: Number,
   		name: String,
   	},
   	timestamp: { type: Date, default: Date.now }
});

module.exports = mongo.model('Message', messageSchema);

exports.schema = messageSchema;