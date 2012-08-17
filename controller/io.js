var Conversation = require('../models/conversation'),
    Thread = require('../models/thread'),
    Message = require('../models/message'),
    tracker = require('../controller/conversation_tracker'),
    Preference = require('../models/preference');

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

exports.postMessage = function(socket, data, socketsCollection){
	Conversation.findById(data.conversationId, function(err, conversation){
        var thread = conversation.threads.id(data.threadId);
        var msg = new Message();
        msg.content = data.content;
        msg.user = socket.handshake.session.user;
        msg.timestamp = data.timestamp;
        thread.messages.push(msg);
        conversation.save();

        emit(data.conversationId, socketsCollection, 'get_message', 
            { 
                content: data.content, 
                user: socket.handshake.session.user, 
                threadId: thread.id,
                timestamp: data.timestamp,
            });
    });
}

function emit(conversationId, socketsCollection, event, data){
    var ids = tracker.getUsersIn(conversationId);
    for (var i = 0; i < ids.length; i++){
        socketsCollection.socket(ids[i]).emit(event, data);
    }
}

exports.openConversation = function(socket, data){
    tracker.addUserToConversation(socket.id, data.conversationId);
}

exports.addThread = function(socket, data, socketsCollection){
    Conversation.findById(data.conversationId, function(err, conversation){
        var thread = new Thread();
        thread.type = data.type;

        var title = new Message();
        title.content = data.title;
        title.user = socket.handshake.session.user;

        thread.messages.push(title);
        conversation.threads.push(thread);
        conversation.save();

        emit(data.conversationId, socketsCollection, 'thread_added', { _id: thread.id, type: thread.type, messages: thread.messages });
    });
}

exports.toggleThread = function(socket, data){
    Preference.findOne({ 'key': data.threadId, 'userId': socket.handshake.session.user.id }, function(err, preference){
        console.log(err);
        if(err !== null){
            preference.flag = data.isCollapsed;
        }else{
            preference = new Preference();
            preference.flag = data.isCollapsed;
            preference.key = data.threadId;
            preference.userId = socket.handshake.session.user.id;
        }

        preference.save();
    });
}

exports.disconnect = function(socket){
    tracker.removeUserFromAllConversations(socket.id);
}
