function createConversation(data) {
  var self = {};

  self.id = data._id;
  self.topic = data.topic;
  self.createdBy = data.createdBy;
  self.unreadCounter = ko.observable(data.unread);
  self.newMessage = ko.observable('');
  
  self.messages = ko.observableArray([]);

  self.focused = ko.observable(false);

  if(data.messages){
    for(var i = 0; i < data.messages.length; i++){
      addMessage(data.messages[i]);
    }
  }

  self.lastMessages = ko.computed(function () {
    if(self.messages().length - 2 >= 0){
      return self.messages.slice(self.messages().length - 2);  
    }else{
      return self.messages();
    }
  });

  function addMessage(data){
    var msg = createMessage(data);
    self.messages.push(msg);
  }

  self.sendMessage = function (data, event) {
    var keyCode = (event.which ? event.which : event.keyCode);
    if (keyCode === 13) {
      sendMessageToServer();
      return false;
    } else {
      return true;
    }
  };

  function sendMessageToServer(){
    var data = 
    { 
        content: self.newMessage(), 
        conversationId: self.id, 
        timestamp: new Date(),
    };

    self.newMessage('');
    socket.emit('send_message', data);
  }

  self.receiveMessage = function(message){
    addMessage(message);
    if(!self.focused()){
      self.unreadCounter(self.unreadCounter() + 1);
    }
  }

  self.showUnreadCounter = ko.computed(function(){
    return self.unreadCounter() > 0;
  });

  return self;
};