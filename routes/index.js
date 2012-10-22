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
	Conversation.find({}, function(err, conversations){
		res.render('conversations', { title: 'chat',
    				conversations: JSON.stringify(conversations) });
	});
}

/*exports.removeConversation = function(req, res){
	Conversation.findById(req.params.id, function(err, conversation){
		conversation.remove(function (){
			res.redirect('/conversations');
		});
	});
};*/