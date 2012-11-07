function createDesktop(data, conversations){
  var self = {};

  self.conversations = ko.observableArray([]);

  for(var i = 0; i < data.conversations.length; i++){
    var conversation = getConversation(data.conversations[i]);
    if(conversation){
      self.conversations.push(conversation);
    }
  }

  self.leftIndex = ko.observable(0);

  self.leftConversation = ko.computed(function(){
    return self.conversations()[self.leftIndex()];
  });

  self.hasLeftConversation = ko.computed(function(){
    return self.leftConversation() !== undefined;
  });

  self.rightConversation = ko.computed(function() {
    var leftIndex = self.conversations.indexOf(self.leftConversation());
    return self.conversations()[leftIndex + 1];
  });

  self.hasRightConversation = ko.computed(function(){
    return self.rightConversation() !== undefined;
  });

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

  self.changeView = function(leftConversation){
    self.leftIndex(self.conversations.indexOf(leftConversation));
  };

  return self;
}