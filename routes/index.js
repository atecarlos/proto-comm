var Conversation = require('../models/conversation'),
    users = require('../models/users'),
    Desktop = require('../models/desktop');

exports.home = function(req, res){
  res.render('index', { title: 'my chat app', users: users });
};

exports.log_in = function(req, res){
  	req.session.user = users.find(req.body.userId);
  	res.redirect('/conversations/');
};

exports.desktop = function(req, res){
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

exports.all = function(req, res){
	Conversation.find({}, function(err, conversations){
		res.render('conversations/all', { title: 'manage conversations', conversations: conversations });
	});
}

exports.remove = function(req, res){
	Conversation.remove( { _id: req.params.id }, function(err){
		res.redirect('/conversations/all');
	});
}