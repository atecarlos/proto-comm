var model = require('../models');

exports.authorize = function(data, accept, sessionStore){
	if (data.headers.cookie) {
        var cookie = require('cookie');
        data.cookie = cookie.parse(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
        sessionStore.load(data.sessionID, function (err, session) {
            if (err || !session) {
                console.log('error getting session');
                // if we cannot grab a session, turn down the connection
                return accept('Error', false);
            } else {
                console.log('success getting session');
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
    socket.broadcast.emit('new_message', data);
}