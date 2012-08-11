var Conversation = require('../models/conversation'),
    Thread = require('../models/thread'),
    Message = require('../models/message');

exports.index = function(req, res){
  res.render('index', { title: 'my chat app' });
};

exports.log_in = function(req, res){
	var username = req.body.username;
  	req.session.username = username;
  	res.redirect('/conversations');
};

exports.getConversations = function(req, res){
	Conversation.find(function(err, conversations){
		res.render('conversations', { conversations: conversations,
									  title: 'conversations'});
	});
}

exports.postConversation = function(req, res){
	var conversation = new Conversation();
	var mainThread = new Thread();

	var title = new Message();
	title.content = req.body.topic;
	title.username = req.session.username;
	
	mainThread.messages.push(title);
	conversation.threads.push(mainThread);
	conversation.save();

	res.redirect('/conversations/' + conversation.id + '/threads');
}

exports.openConversation = function(req, res){
	var conversation = Conversation.findById(req.params.id, function(err, conversation){
		if(req.params.format == 'json'){
			console.log(req);
			var thread = conversation.threads.id(req.params.id);
			res.json(thread.messages);
		}else{
			res.render('threads', { title: 'threads', 
    							 username: req.session.username,
    							 conversation: JSON.stringify(conversation) });
		}
	});
}

exports.getMessages = function(req, res){
	var conversation = Conversation.findById(req.params.id, function(err, conversation){
		thread = conversation.threads.id(req.params.threadId);
		res.json(thread.messages);
	});
}