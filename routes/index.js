var Conversation = require('../models/conversation'),
    users = require('../models/users'),
    Desktop = require('../models/desktop');

exports.config = function(app){
	app.get('/', home);

	app.post('/log-in', log_in);

	app.get('/conversations/', desktop);

	app.get('/conversations/all', all);

	app.post('/conversations/:id/remove', remove);
}

function home(req, res){
  res.render('index', { title: 'my chat app', users: users });
};

function log_in(req, res){
  	req.session.user = users.find(req.body.userId);
  	res.redirect('/conversations/');
};

function desktop(req, res){
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

function all(req, res){
	Conversation.find({}, function(err, conversations){
		res.render('conversations/all', { title: 'manage conversations', conversations: conversations });
	});
}

function remove(req, res){
	Conversation.remove( { _id: req.params.id }, function(err){
		res.redirect('/conversations/all');
	});
}