var model = require('../models');

exports.authorize = function(data, accept, sessionStore){
	if (data.headers.cookie) {
        var cookie = require('cookie');
        data.cookie = cookie.parse(data.headers.cookie);
        data.sessionID = unescape(data.cookie['express.sid']);
        sessionStore.load(data.sessionID, function (err, session) {
            if (err || !session) {
                return accept('Error', false);
            } else {
                data.session = session;
                return accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
}

exports.post = function(socket, data){
	var msg = new model();
    msg.text = data.msg;
    msg.name = socket.handshake.session.name;
    msg.save();
    socket.broadcast.emit('new_message', { text: msg.text, name: msg.name });
}
