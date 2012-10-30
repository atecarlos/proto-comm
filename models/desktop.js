var mongo = require('mongoose');

var schema = new mongo.Schema({
	strip: [ mongo.Schema.Types.ObjectId ],
	active: [ mongo.Schema.Types.ObjectId ],
	userId: Number,
});

module.exports = mongo.model('Desktop', schema);

exports.schema = schema;