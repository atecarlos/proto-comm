function createDesktop(data, conversations){
  var self = {};

  self.id = data._id;

  self.conversations = ko.observableArray([]);

  for(var i = 0; i < data.conversations.length; i++){
    var conversation = getConversationBy(data.conversations[i]);
    if(conversation){
      self.conversations.push(conversation);
    }
  }

  function getConversationBy(id){
    for(var c = 0; c < conversations.length; c++){
      if(conversations[c].id == id){
        return conversations[c];
      }
    }
  }

  self.leftConversationIndex = ko.observable(0);

  self.leftConversation = ko.computed(function(){
    return getConversationAt(self.leftConversationIndex());
  });

  self.rightConversation = ko.computed(function(){
    return getConversationAt(self.leftConversationIndex() + 1);
  });

  function getConversationAt(index){
    var conversation = self.conversations()[index];
    if(conversation){
      if(conversation.unreadCounter() > 0){
        conversation.unreadCounter(0);
        socket.emit('mark_as_read', conversation.id);
      }
    }
    return conversation;
  }

  self.hasLeftConversation = ko.computed(function(){
    return self.leftConversation() !== undefined;
  });

  self.hasRightConversation = ko.computed(function(){
    return self.rightConversation() !== undefined;
  });

  function hasConversation(conversation){
    return self.conversations.indexOf(conversation) >= 0;
  }

  self.add = function(conversation){
    if(!hasConversation(conversation)){
      socket.emit('add_to_desktop', { id: self.id, conversationId: conversation.id });
      self.conversations.push(conversation);
    }
  };

  self.addAndFocus = function(conversation){
    self.add(conversation);
    self.focus(conversation);
  }

  self.remove = function(conversation){
    socket.emit('remove_from_desktop', { id: self.id, conversationId: conversation.id });
    var index = self.conversations.indexOf(conversation);
    self.conversations.splice(index, 1);
    self.focus();
  };

  self.focus = function(leftConversation){
    clearFocus();

    if(leftConversation){
      self.leftConversationIndex(self.conversations.indexOf(leftConversation));
    }

    if(self.hasLeftConversation()){
      self.leftConversation().focused(true);
    }

    if(self.hasRightConversation()){
      self.rightConversation().focused(true);
    }

    updateActiveConversations();
  };

  function updateActiveConversations(){
    var conversations = [];
    if(self.hasLeftConversation()) conversations.push(self.leftConversation().id);
    if(self.hasRightConversation()) conversations.push(self.rightConversation().id);
    socket.emit('new_active_conversation', conversations);
  }

  function clearFocus(){
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      conversation.focused(false);
    });
  };

  self.focus();

  self.setupSorting = function(){
    var currentSort;

    $('.film-strip').sortable({
      start: function(event, ui){
        currentSort = { startIndex: ui.item.index(), stopIndex: -1 };
      },
      stop: function(event, ui){
        currentSort.stopIndex = ui.item.index();
        socket.emit('update_strip_order', { id: self.id, currentSort: currentSort });
        clearFocus();
        reorder();
        self.focus();
      }
    });

    function reorder(){
      var conversation = self.conversations()[currentSort.startIndex];
      self.conversations.splice(currentSort.startIndex, 1);
      self.conversations.splice(currentSort.stopIndex, 0, conversation);
    }

    $('.film-strip').disableSelection();
  };

  return self;
}