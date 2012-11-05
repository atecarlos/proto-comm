function createDesktop(data, conversations){
  var self = {};

  self.conversations = ko.observableArray([]);

  for(var i = 0; i < data.conversations.length; i++){
    var conversation = getConversation(data.conversations[i]);
    if(conversation){
      self.conversations.push(conversation);
    }
  }

  function getConversation(conversationId){
    for(var c = 0; c < conversations.length; c++){
      if(conversations[c].id == conversationId){
        return conversations[c];
      }
    }
  }

  self.add = function(conversation){
    socket.emit('add_to_desktop', { conversationId: conversation.id });
    self.conversations.push(conversation);
  };

  self.remove = function(conversation){
    socket.emit('remove_from_desktop', { conversationId: conversation.id });
    var index = self.conversations.indexOf(conversation);
    self.conversations.splice(index, 1);
  };

  return self;
}