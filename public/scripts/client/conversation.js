function createConversation(data) {
  var self = {};

  self.id = data._id;
  self.topic = data.topic;
  self.createdBy = data.createdBy;

  self.newMessage = ko.observable('');
  
  self.messages = ko.observableArray([]);

  if(data.messages){
    for(var i = 0; i < data.messages.length; i++){
      addMessage(data.messages[i]);
    }
  }

  function addMessage(data){
    var msg = createMessage(data);
    self.messages.push(msg);
  }

  self.hasMessages = ko.computed(function() {
    return self.messages().length > 0;
  });

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
  }

  self.focused = ko.observable(false);

  return self;
};