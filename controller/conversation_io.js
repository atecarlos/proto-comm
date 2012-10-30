var Conversation = require('../models/conversation'),
    Message = require('../models/message');

exports.sendMessage = function(socket, data){
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
        });
    });
}

exports.createConversation = function(socket, data){
    var conversation = new Conversation();
    conversation.topic = data.topic;
    conversation.createdBy = socket.handshake.session.user.name;
    conversation.save(function(err){
        var dataToEmit = { _id: conversation.id, topic: conversation.topic, createdBy: conversation.createdBy };
        socket.emit('conversation_added', dataToEmit);
        socket.broadcast.emit('new_conversation_added', dataToEmit);
    });
}