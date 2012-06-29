var Conversation = require('../models/conversation');

exports.index = function(req, res){
  res.render('index', { title: 'my chat app' });
};

exports.log_in = function(req, res){
	var name = req.body.name;
  	req.session.name = name;
  	res.redirect('/conversations');
};

exports.get_conversations = function(req, res){
	Conversation.find(function(err, conversations){
		res.render('conversations', { conversations: conversations,
									  title: 'conversations'});
	});
}

exports.post_conversations = function(req, res){
	var conversation = new Conversation();
	conversation.topic = req.body.topic;
	conversation.save();

	res.redirect('/messages');
}

exports.get_messages = function(req, res){
	console.log('*****************');
	console.log(req.params.id);
	console.log('*****************');

	var conversation = Conversation.findById(req.params.id, function(err, conversation){
		res.render('messages', { messages: conversation.messages, 
    							 title: 'messages', 
    							 name: req.session.name,
    							 conversation: req.params.id });
	});
}