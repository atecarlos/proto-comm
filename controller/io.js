var Conversation = require('../models/conversation'),
    Thread = require('../models/thread'),
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

        emit(data.conversationId, socketsCollection, 'new_message', 
            { text: data.msg, name: socket.handshake.session.name, threadId: thread.id });
    });
}

function emit(conversationId, socketsCollection, event, data){
    var ids = Tracker.getUsersIn(conversationId);
    for (var i = 0; i < ids.length; i++){
        socketsCollection.socket(ids[i]).emit(event, data);
    }
}

exports.openConversation = function(socket, data){
    Tracker.addUserToConversation(socket.id, data.conversationId);
}

exports.addThread = function(socket, data, socketsCollection){
    Conversation.findById(data.conversationId, function(err, conversation){
        var thread = new Thread();
        conversation.threads.push(thread);
        conversation.save();

        emit(data.conversationId, socketsCollection, 'thread_added', { id: thread.id });
    });
}

exports.disconnect = function(socket){
    Tracker.removeUserFromAllConversations(socket.id);
}
