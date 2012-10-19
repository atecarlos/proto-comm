function createViewModel(data, preferences) {
  var self = {};
  
  // self.newConversation = ko.observable('');
  
  self.conversations = ko.observableArray([]);

  for(var i = 0; i < data.length; i++){
    self.conversations.push(createConversation(data[i]));
  }

  /*self.addNewConversation = function(data, event) {
    var keyCode = (event.which ? event.which : event.keyCode);
    if (keyCode === 13) {
      addConversation();
      self.toggleNewConversation();
      return false;
    } else {
      return true;
    }
  };
  
  self.toggleNewConversation = function (){
    $('#newConversation').modal('toggle');
    setTimeout(function () { $('#newConversation input').focus(); }, 400);
  }

  function addConversation() {
    socket.emit('create_conversation', { topic: self.newConversation(), conversationId: self.id });
  };

  socket.on('conversation_added', function(data){
    var conversation = createConversation(data, undefined, self);
    self.conversations.push(conversation);
    self.newConversation('');
    // scrollSubConversations();
    conversation.focused(true);
  });

  function scrollSubConversations() {
    $('#sub-conversations').scrollTop($('#sub-conversations > .conversations').height())
  };*/

  socket.on('receive_message', function(data) {
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      if(data.conversationId === conversation.id){
        conversation.receiveMessage(data);
        adjustScrolling();
      }
    });
  });

  function adjustScrolling(){
    $(".nano").nanoScroller();
  }

  /*self.unreadCounter = ko.computed(function (){
    var total = 0;
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      total += conversation.unreadCounter();
    });
    return total;
  });*/

  return self;
}