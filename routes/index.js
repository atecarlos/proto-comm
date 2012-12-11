var Conversation = require('../models/conversation'),
    users = require('../models/users'),
    Desktop = require('../models/desktop'),
    UnreadMarker = require('../models/unread_marker');

exports.config = function(app){
	app.get('/', home);

	app.post('/log-in', log_in);

	app.get('/conversations/', desktop);
}

function home(req, res){
  res.render('index', { title: 'my chat app', users: users.list });
}

function log_in(req, res){
  	req.session.user = users.find(req.body.userId);
  	res.redirect('/conversations/');
}

function desktop(req, res){
	Conversation.find({}, function(err, conversations){
		
		Desktop.findOrCreateByUserId(req.session.user.id, function(err, desktop){
				
			UnreadMarker.find({ userId: req.session.user.id }, function(err, markers){
				conversations.forEach(function(conversation){
					conversation._doc.unread = 0;
					
					markers.forEach(function(marker){
						if(marker.conversationId.equals(conversation._id)){
							conversation._doc.unread = marker.count;
						}
					});
				});
					
				res.render('conversations', { title: 'desktop',
		    	conversations: JSON.stringify(conversations),
		    	desktop: JSON.stringify(desktop) });
			});
		});
	});
}