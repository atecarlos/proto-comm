var Conversation = require('../models/conversation');

exports.index = function(req, res){
  res.render('index', { title: 'my chat app' });
};

exports.log_in = function(req, res){
	var name = req.body.name;
  	req.session.name = name;
  	res.redirect('/conversations');
};

exports.getConversations = function(req, res){
	Conversation.find(function(err, conversations){
		res.render('conversations', { conversations: conversations,
									  title: 'conversations'});
	});
}

exports.postConversations = function(req, res){
	var conversation = new Conversation();
	conversation.topic = req.body.topic;
	conversation.save();

	res.redirect('/conversations/' + conversation.id + '/messages');
}

exports.openConversation = function(req, res){
	var conversation = Conversation.findById(req.params.id, function(err, conversation){
		res.render('messages', { title: 'messages', 
    							 name: req.session.name,
    							 conversation: conversation });
	});
}