var mongo = require('mongoose');

var schema = new mongo.Schema({
	flags: {
		isCollapsed: Boolean,
		isDismissed: Boolean,
	},
	conversationId: mongo.Schema.Types.ObjectId,
	userId: Number,
});

module.exports = mongo.model('Preference', schema);

exports.schema = schema;