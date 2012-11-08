function createDesktop(data, conversations){
  var self = {};

  self.conversations = ko.observableArray([]);

  for(var i = 0; i < data.conversations.length; i++){
    var conversation = getConversation(data.conversations[i]);
    if(conversation){
      self.conversations.push(conversation);
    }
  }

  self.leftConversation = ko.observable();
  self.rightConversation = ko.observable();

  function setAsLeftConversation(leftConversation){
    self.leftConversation(leftConversation);
    self.leftConversation().focused(true);
  };

  function setAsRightConversation(rightConversation){
    self.rightConversation(rightConversation);
    
    if(self.rightConversation()){
      self.rightConversation().focused(true);
    }
  }

  setAsLeftConversation(self.conversations()[0]);
  setAsRightConversation(self.conversations()[1]);

  self.hasLeftConversation = ko.computed(function(){
    return self.leftConversation() !== undefined;
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

  function hasConversation(conversation){
    return self.conversations.indexOf(conversation) >= 0;
  }

  self.add = function(conversation){
    if(!hasConversation(conversation)){
      socket.emit('add_to_desktop', { conversationId: conversation.id });
      self.conversations.push(conversation);
    }
  };

  self.addAndFocus = function(conversation){
    self.add(conversation);
    self.focus(conversation);
  }

  self.remove = function(conversation){
    socket.emit('remove_from_desktop', { conversationId: conversation.id });
    var index = self.conversations.indexOf(conversation);
    self.conversations.splice(index, 1);
  };

  self.focus = function(leftConversation){
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      conversation.focused(false);
    });

    setAsLeftConversation(leftConversation);

    var leftConversationIndex = self.conversations.indexOf(leftConversation);
    setAsRightConversation(self.conversations()[leftConversationIndex + 1]);
  };

  return self;
}