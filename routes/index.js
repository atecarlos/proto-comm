var Conversation = require('../models/conversation'),
    Message = require('../models/message'),
    users = require('../models/users'),
    Preference = require('../models/conversation_preference');

exports.home = function(req, res){
  res.render('index', { title: 'my chat app', users: users });
};

exports.log_in = function(req, res){
  	req.session.user = users.find(req.body.userId);
  	res.redirect('/conversations');
};

exports.readConversations = function(req, res){
	Conversation.find(function(err, conversations){
		res.render('conversations', { conversations: conversations,
									  title: 'conversations'});
	});
}

exports.createConversation = function(req, res){
	var conversation = new Conversation();
	conversation.topic = req.body.topic;
	conversation.createdBy = req.session.user.name;
	conversation.save();

	res.redirect('/conversations/' + conversation.id);
}

exports.readConversation = function(req, res){
	var conversation = Conversation.findById(req.params.id, function(err, conversation){
		var userPreferences;
		Preference.find({ 'userId': req.session.user.id, 'conversationId':conversation._id }, function(err, preferences){
			res.render('conversations/chat', { title: 'chat',
    						 		conversation: JSON.stringify(conversation),
    						 		preferences: JSON.stringify(preferences) });
		});
	});
}

exports.removeConversation = function(req, res){
	var conversation = Conversation.findById(req.params.id, function(err, conversation){
		conversation.remove(function (){
			res.redirect('/conversations');
		});
	});
};