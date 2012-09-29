var Conversation = require('../models/conversation'),
    Thread = require('../models/thread'),
    Message = require('../models/message'),
    tracker = require('../controller/conversation_tracker'),
    Preference = require('../models/thread_preference');

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

exports.sendMessage = function(socket, data, socketsCollection){
	Conversation.findById(data.conversationId, function(err, conversation){
        var thread = conversation.threads.id(data.threadId);
        var msg = new Message();
        msg.content = data.content;
        msg.user = socket.handshake.session.user;
        msg.timestamp = data.timestamp;
        thread.messages.push(msg);
        conversation.save();

        emit(data.conversationId, socketsCollection, 'receive_message', 
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
        thread.topic = data.topic;
        thread.createdBy = socket.handshake.session.user.name;

        conversation.threads.push(thread);
        conversation.save();

        emit(data.conversationId, socketsCollection, 'thread_added', { _id: thread.id, topic: thread.topic, createdBy: thread.createdBy });
    });
}

exports.toggleThread = function(socket, data){
    addOrUpdatePreference(data, socket.handshake.session.user.id, function(preference, flag){
        preference.flags.isCollapsed = flag;
    });
}

exports.dismissThread = function(socket, data){
    addOrUpdatePreference(data, socket.handshake.session.user.id, function(preference, flag){
        preference.flags.isDismissed = flag;
    });
}

function addOrUpdatePreference(data, userId, updateFlag){
    Preference.findOne({ 'threadId': data.threadId, 'userId': userId }, function(err, preference){
        if(preference !== null){
            updateFlag(preference, data.flag);
        }else{
            preference = new Preference();
            preference.conversationId = data.conversationId;
            preference.threadId = data.threadId;
            preference.userId = userId;

            updateFlag(preference, data.flag);
        }

        preference.save();
    });
}

exports.disconnect = function(socket){
    tracker.removeUserFromAllConversations(socket.id);
}
