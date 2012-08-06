var Conversation = require('../models/conversation'),
    Message = require('../models/message'),
    Tracker = require('../controller/conversation_tracker');

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

exports.post = function(socket, data, socketsCollection){
	Conversation.findById(data.conversationId, function(err, conversation){
        var thread = conversation.threads.id(data.threadId);
        var msg = { text: data.msg, name: socket.handshake.session.name };
        thread.messages.push(msg);
        conversation.save();
    });

    var ids = Tracker.getUsersIn(data.conversationId);
    for (var i = 0; i < ids.length; i++){
        console.log(ids[i]);
        socketsCollection.socket(ids[i]).emit('new_message', { text: data.msg, name: socket.handshake.session.name, threadId: thread.id });
    }
}

exports.openConversation = function(socket, conversationId){
    Tracker.addUserToConversation(socket.id, conversationId);
}

exports.disconnect = function(socket){
    Tracker.removeUserFromAllConversations(socket.id);
}
