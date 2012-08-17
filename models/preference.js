var mongo = require('mongoose');

var preferenceSchema = new mongo.Schema({
	flag: Boolean,
	key: String,
	userId: Number,
});

module.exports = mongo.model('Preference', preferenceSchema);

exports.schema = preferenceSchema;