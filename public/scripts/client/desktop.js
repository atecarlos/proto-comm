function createDesktop(data){
  var self = {};

  self.strip = ko.observableArray(data.strip);
  self.active = ko.observableArray(data.active);

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
  	socket.emit('add_to_active', { conversationId: conversation.id });
    self.active.push(conversation);
  }

  return self;
}