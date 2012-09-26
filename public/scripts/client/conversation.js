function createConversation(data, preferences) {
  var self = {};

  self.id = data._id;
  self.mainThread = createThread(data.threads[0], undefined, self);
  self.mainThread.messages.subscribe(function (newValue) {
    self.scrollMainThread();
  });

  self.scrollMainThread = function () {
    $('#main-thread').scrollTop($('#main-thread > .messages').height());
  };
  
  self.newThread = ko.observable('');
  
  self.threads = ko.observableArray([]);

  for(var i = 1; i < data.threads.length; i++){
    var preference = preferences.getPreferenceFor(data.threads[i]._id);
    self.threads.push(createThread(data.threads[i], preference, self));
  }

  self.hasThreads = ko.computed(function (){
    return self.threads().length > 0;
  });

  self.addNewThread = function(data, event) {
    var keyCode = (event.which ? event.which : event.keyCode);
    if (keyCode === 13) {
      addThread();
      self.toggleNewThread();
      return false;
    } else {
      return true;
    }
  };
  
  self.toggleNewThread = function (){
    $('#newThread').modal('toggle');
    setTimeout(function () { $('#newThread input').focus(); }, 400);
  }

  function addThread() {
    socket.emit('post_thread', { title: self.newThread(), conversationId: self.id });
  };

  socket.on('thread_added', function(data){
    var thread = createThread(data);
    self.threads.push(thread);
    self.newThread('');
    self.scrollSubThreads();
    thread.focused(true);
  });

  function scrollSubThreads() {
    $('#sub-threads').scrollTop($('#sub-threads > .threads').height())
  };

  socket.on('receive_message', function(data) {
    if(data.threadId == self.mainThread.id){
      self.mainThread.receiveMessage(data);
      self.mainThread.newMessage('');
    }else{
        ko.utils.arrayForEach(self.threads(), function(thread){
        if(data.threadId === thread.id){
          thread.receiveMessage(data);
          thread.newMessage('');
        }
      });
    }
  });

  self.unreadCounter = ko.computed(function (){
    var total = 0;
    ko.utils.arrayForEach(self.threads(), function(thread){
      total += thread.unreadCounter();
    });
    return total;
  });

  return self;
}