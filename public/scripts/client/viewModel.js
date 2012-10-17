function createViewModel(data, preferences) {
  var self = {};
  
  self.newConversation = ko.observable('');
  
  self.conversations = ko.observableArray([]);

  for(var i = 1; i < data.conversations.length; i++){
    var preference = preferences.getPreferenceFor(data.conversations[i]._id);
    self.conversations.push(createConversation(data.conversations[i], preference, self));
  }

  self.addNewConversation = function(data, event) {
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

  /*function scrollSubConversations() {
    $('#sub-conversations').scrollTop($('#sub-conversations > .conversations').height())
  };*/

  socket.on('receive_message', function(data) {
    if(data.conversationId == self.mainConversation.id){
      self.mainConversation.receiveMessage(data);
    }else{
        ko.utils.arrayForEach(self.conversations(), function(conversation){
          if(data.conversationId === conversation.id){
            conversation.receiveMessage(data);
          }
      });
    }
  });

  /*self.unreadCounter = ko.computed(function (){
    var total = 0;
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      total += conversation.unreadCounter();
    });
    return total;
  });*/

  return self;
}