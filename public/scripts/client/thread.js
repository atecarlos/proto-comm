function createThread(data, preference, conversation) {
  var self = {};

  self.id = data._id;
  self.type = data.type;

  if (data.messages.length > 0){
    self.title = createMessage(data.messages[0]);
  } else {
    self.title = createMessage({content: 'missing title'});
  }

  self.newMessage = ko.observable('');
  
  self.messages = ko.observableArray([]);

  if(data.messages){
    for(var i = 1; i < data.messages.length; i++){
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
        conversationId: conversation.id, 
        threadId: self.id,
        timestamp: new Date(),
    };

    socket.emit('send_message', data);
  }

  self.receiveMessage = function(message){
    console.log('message received')
    if(self.dismissed()){
      setCollapsedFlagTo(true);
      self.toggleDismiss();
      self.unreadCounter(self.unreadCounter() + 1);
    }else if(self.collapsed()){
      self.unreadCounter(self.unreadCounter() + 1);      
    }

    addMessage(message);
    adjustScrolling();
  }

  self.unreadCounter = ko.observable(0);

  self.showCounter = ko.computed(function() {
    return self.unreadCounter() > 0;
  });

  self.collapsed = ko.observable(preference ? preference.flags.isCollapsed : false);
  self.dismissed = ko.observable(preference ? preference.flags.isDismissed : false);

  self.toggleCollapse = function(){
    if(self.expanded()){
      expand(false);
    }
    self.unreadCounter(0);
    setCollapsedFlagTo(!self.collapsed());
  };

  function setCollapsedFlagTo(value){
    self.collapsed(value);
    socket.emit('toggle_thread', { threadId: self.id, conversationId: conversation.id, flag: self.collapsed() });
    adjustScrolling();
  };

  self.toggleDismiss = function(){
    self.dismissed(!self.dismissed());
    socket.emit('dismiss_thread', { threadId: self.id, conversationId: conversation.id, flag: self.dismissed() });
    adjustScrolling();
  };

  self.focused = ko.observable(false);

  self.focused.subscribe(function (hasFocus){
    console.log(hasFocus);
  });

  self.menuClick = function (){
    if(self.dismissed()){
      self.toggleDismiss();
    }
    if(self.collapsed()){
      self.toggleCollapse();
    }
    self.focused(true);
  };

  self.hidden = ko.observable(false);
  self.expanded = ko.observable(false);

  self.toggleExpand = function () {
    self.collapsed(false);
    expand(!self.expanded());
  }

  function expand(toExpand){
    self.expanded(toExpand);
    showHideOtherThreads(toExpand);
    adjustScrolling();
  }

  function showHideOtherThreads (showOrHide) {
    var threads = conversation.threads();
    for (var i = 0; i < threads.length; i++) {
      if (threads[i].id !== self.id) {
        threads[i].hidden(showOrHide);
      }
    }
  }

  self.shownMessages = ko.computed(function (){
    var length = self.messages().length;

    if(self.expanded() || length <= 4){
      return self.messages;
    }else{
      return self.messages.slice(length - 4, length);
    }
  });

  function adjustScrolling(){
    $(".nano").nanoScroller();
  }

  return self;
};