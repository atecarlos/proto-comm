var Conversation = require('../models/conversation'),
    Message = require('../models/message'),
    tracker = require('../controller/conversation_tracker'),
    Preference = require('../models/conversation_preference');

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
        var msg = new Message();
        msg.content = data.content;
        msg.user = socket.handshake.session.user;
        msg.timestamp = data.timestamp;
        conversation.messages.push(msg);
        conversation.save();

        emit(data.conversationId, socketsCollection, 'receive_message', 
            { 
                content: data.content, 
                user: socket.handshake.session.user, 
                conversationId: data.conversationId,
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

exports.createConversation = function(socket, data){
    var conversation = new Conversation();
    conversation.topic = data.topic;
    conversation.createdBy = socket.handshake.session.user.name;
    conversation.save();
    tracker.addUserToConversation(socket.id, conversation.id);

    var dataToEmit = { _id: conversation.id, topic: conversation.topic, createdBy: conversation.createdBy };
    socket.emit('conversation_added', dataToEmit);
    socket.broadcast.emit('conversation_added', dataToEmit);
}

/*exports.toggleThread = function(socket, data){
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
}*/

exports.disconnect = function(socket){
    tracker.removeUserFromAllConversations(socket.id);
}
