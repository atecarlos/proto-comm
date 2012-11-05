var Conversation = require('../models/conversation'),
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
		Desktop.findOne({ userId: req.session.user.id },
				function(err, desktop){
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