var mongo = require('mongoose');

var preferenceSchema = new mongo.Schema({
	flags: {
		isCollapsed: Boolean,
		isDismissed: Boolean,
	},
	threadId: mongo.Schema.Types.ObjectId,
	conversationId: mongo.Schema.Types.ObjectId,
	userId: Number,
});

module.exports = mongo.model('Preference', preferenceSchema);

exports.schema = preferenceSchema;