var Conversation = require('../models/conversation'),
    Message = require('../models/message'),
    users = require('../models/users'),
    Unread = require('../models/unread');

exports.sendMessage = function(socket, data, activeUsers){
	Conversation.findById(data.conversationId, function(err, conversation){
        var msg = new Message();
        msg.content = data.content;
        msg.user = socket.handshake.session.user;
        msg.timestamp = data.timestamp;
        conversation.messages.push(msg);
        conversation.save(function(err){
            var dataToEmit = {
                content: data.content, 
                user: socket.handshake.session.user, 
                conversationId: data.conversationId,
                timestamp: data.timestamp,
            };

            socket.emit('receive_message', dataToEmit);
            socket.broadcast.emit('receive_message', dataToEmit);

            saveUnreadMarkers(activeUsers, msg);
        });
    });
};

function saveUnreadMarkers(activeUsers, msg){
    var inactiveUsers = users.allExcept(activeUsers);
    console.log(inactiveUsers);
    var unreadMessage = new Unread();
    unreadMessage.unreadBy = inactiveUsers;
    unreadMessage.elementId = msg._id;
    unreadMessage.save();    
}

exports.createConversation = function(socket, data){
    var conversation = new Conversation();
    conversation.topic = data.topic;
    conversation.createdBy = socket.handshake.session.user.name;
    conversation.save(function(err){
        var dataToEmit = { _id: conversation.id, topic: conversation.topic, createdBy: conversation.createdBy };
        socket.emit('conversation_added', dataToEmit);
        socket.broadcast.emit('conversation_added', dataToEmit);
    });
};