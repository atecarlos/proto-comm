function createDesktop(data, conversations){
  var self = {};

  self.strip = ko.observableArray([]);
  self.active = ko.observableArray([]);

  for(var i = 0; i < data.active.length; i++){
    var activeConversation = getConversation(data.active[i]);
    if(activeConversation){
      self.active.push(activeConversation);
    }
  }

  for(var j = 0; j < data.strip.length; j++){
    var conversationInStrip = getConversation(data.strip[j]);
    if(conversationInStrip){
      self.strip.push(conversationInStrip);
    }
  }

  function getConversation(conversationId){
    for(var c = 0; c < conversations.length; c++){
      if(conversations[c].id == conversationId){
        return conversations[c];
      }
    }
  }

  self.addToStrip = function(conversation){
    socket.emit('add_to_strip', { conversationId: conversation.id });
    self.strip.push(conversation);
  };

  self.removeFromStrip = function(conversation){
    socket.emit('remove_from_strip', { conversationId: conversation.id });
    var index = self.strip.indexOf(conversation);
    self.strip.splice(index, 1);
  };

  self.addToActive = function(conversation){
    self.addToStrip(conversation);
  	socket.emit('add_to_active', { conversationId: conversation.id });
    self.active.push(conversation);
  }

  return self;
}