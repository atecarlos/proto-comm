var mongo = require('mongoose');

mongo.connect('mongodb://localhost/express_test');

var messageSchema = new mongo.Schema({
   	text: String,
   	name: String,
});

module.exports = mongo.model('Message', messageSchema);