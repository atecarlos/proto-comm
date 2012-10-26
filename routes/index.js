var Conversation = require('../models/conversation'),
    Message = require('../models/message'),
    users = require('../models/users'),
    Desktop = require('../models/desktop');

exports.home = function(req, res){
  res.render('index', { title: 'my chat app', users: users });
};

exports.log_in = function(req, res){
  	req.session.user = users.find(req.body.userId);
  	res.redirect('/conversations');
};

exports.readConversations = function(req, res){
	Conversation.find({}, function(err, conversations){
		Desktop.findOne({ userId: req.session.user.id }).populate('strip').exec(function(err, desktop){
			if(desktop == null){
				desktop = new Desktop();
				desktop.userId = req.session.user.id;
				desktop.save();
			}
			res.render('conversations', { title: 'desktop',
    				conversations: JSON.stringify(conversations),
    				desktop: JSON.stringify(desktop) });
		});
	});
}

/*exports.removeConversation = function(req, res){
	Conversation.findById(req.params.id, function(err, conversation){
		conversation.remove(function (){
			res.redirect('/conversations');
		});
	});
};*/