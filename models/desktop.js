var mongo = require('mongoose');

var schema = new mongo.Schema({
	conversations: [ mongo.Schema.Types.ObjectId ],
	userId: Number,
});

module.exports = mongo.model('Desktop', schema);

exports.schema = schema;