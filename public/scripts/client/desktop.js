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

  function setLeftAndRightConversation(leftConversation){
    self.leftConversation(leftConversation);
    self.leftConversation().focused(true);
    self.leftConversation().unreadCounter(0);

    var leftConversationIndex = self.conversations.indexOf(leftConversation);
    var rightConversation = self.conversations()[leftConversationIndex + 1];
    self.rightConversation(rightConversation);
    
    if(self.rightConversation()){
      self.rightConversation().focused(true);
      self.rightConversation().unreadCounter(0);
    }
  };

  setLeftAndRightConversation(self.conversations()[0]);

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
    clearFocus();
    setLeftAndRightConversation(leftConversation);
  };

  function clearFocus(){
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      conversation.focused(false);
    });
  }

  self.setupSorting = function(){
    var currentSort = { startIndex: -1, stopIndex: -1 };

    $('.film-strip').sortable({
      start: function(event, ui){
        currentSort.startIndex = ui.item.index();
      },
      stop: function(event, ui){
        currentSort.stopIndex = ui.item.index();
        socket.emit('change_index', currentSort);
        reorder();
      }
    });

    function reorder(){
      var conversation = self.conversations()[currentSort.startIndex];
      self.conversations.splice(currentSort.startIndex, 1);
      self.conversations.splice(currentSort.stopIndex, 0, conversation);
    }

    $('.film-strip').disableSelection();
  }

  return self;
}