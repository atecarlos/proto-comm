var mongo = require('mongoose');

var preferenceSchema = new mongo.Schema({
	flag: Boolean,
	key: ObjectId,
	userId: Number,
});

module.exports = mongo.model('Preference', preferenceSchema);

exports.schema = preferenceSchema;