var model = require('../models');

exports.index = function(req, res){
  res.render('index', { title: 'my chat app' });
};

exports.log_in = function(req, res){
	var name = req.body.name;
  	req.session.name = name;
  	res.redirect('/messages');
};

exports.get_messages = function(req, res){
	model.find(function(err, messages){
    	res.render('messages', { messages: messages, 
    							 title: 'my chat app', 
    							 name: req.session.name });
  	});
}