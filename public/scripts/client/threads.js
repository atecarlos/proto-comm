var socket = io.connect(window.location.origin);
var conversation;
var threadTypes = { question: 'Q', idea: 'I' };

function Message(data) {
  var self = this;

  self.content = ko.observable(data.content);
  self.timestamp = formatTimestamp(data.timestamp);
  self.username = data.user.name;

  function formatTimestamp(timestamp) {
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    return month + '/' + day + ' ' + hour + ':' + minute;
  }
}

function Thread(data, preference) {
  var self = this;

  self.id = data._id;
  self.type = data.type;
  self.isQuestion = data.type === threadTypes.question;
  self.isIdea = data.type === threadTypes.idea;

  if (data.messages.length > 0){
    self.title = new Message(data.messages[0]);
  } else {
    self.title = new Message({content: 'missing title'});
  }

  self.newMessage = ko.observable('');
  
  self.messages = ko.observableArray([]);

  if(data.messages){
    for(var i = 1; i < data.messages.length; i++){
      addMessage(data.messages[i]);
    }
  }

  function addMessage(data){
    var message = new Message(data);
    self.messages.push(message);
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

  socket.on('receive_message', function(data) {
    if(data.threadId === self.id){
      receiveMessage(data);
      self.newMessage('');
    }
  });

  function receiveMessage(message){
    if(self.dismissed()){
      setCollapsedFlagTo(true);
      self.toggleDismiss();
      self.unreadCounter(self.unreadCounter() + 1);
    }else if(self.collapsed()){
      self.unreadCounter(self.unreadCounter() + 1);      
    }

    addMessage(message);
  }

  self.unreadCounter = ko.observable(0);

  self.collapsed = ko.observable(preference ? preference.flags.isCollapsed : false);
  self.dismissed = ko.observable(preference ? preference.flags.isDismissed : false);

  self.toggleCollapse = function(){
    self.unreadCounter(0);
    setCollapsedFlagTo(!self.collapsed());
  }

  function setCollapsedFlagTo(value){
    self.collapsed(value);
    socket.emit('toggle_thread', { threadId: self.id, conversationId: conversation.id, flag: self.collapsed() });
  }

  self.toggleDismiss = function(){
    self.dismissed(!self.dismissed());
    socket.emit('dismiss_thread', { threadId: self.id, conversationId: conversation.id, flag: self.dismissed() });
  }

  self.menuClick = function (){
    if(self.collapsed()){
      self.toggleCollapse();
    }
  }
};

function Conversation(data, preferences) {
  var self = this;

  self.id = data._id;
  self.mainThread = new Thread(data.threads[0]);
  self.mainThread.messages.subscribe(function (newValue) {
    self.scrollMainThread();
  });

  self.newThread = ko.observable('');
  
  self.threads = ko.observableArray([]);

  for(var i = 1; i < data.threads.length; i++){
    var preference = preferences.getPreferenceFor(data.threads[i]._id);
    self.threads.push(new Thread(data.threads[i], preference));
  }

  self.addNewThread = function(data, event) {
    var keyCode = (event.which ? event.which : event.keyCode);
    if (keyCode === 13) {
      addThread();
      toggleNewThread();
      self.newThread('');
      return false;
    } else {
      return true;
    }
  };
      
  function addThread() {
    socket.emit('post_thread', { title: self.newThread(), conversationId: self.id });
  };

  socket.on('thread_added', function(data){
    self.threads.push(new Thread(data));
    self.newThread('');
    self.scrollSubThreads();
  });

  self.scrollMainThread = function () {
    $('#main-thread').scrollTop($('#main-thread > .messages').height());
  };

  self.scrollSubThreads = function () {
    $('#sub-threads').scrollTop($('#sub-threads > .threads').height())
  };
}

function Preferences(data){
  var self = this;

  self.getPreferenceFor = function(threadId){
    for(var i = 0; i < data.length; i++){
      if(data[i].threadId == threadId){
        return data[i];
      }
    }
  }
}

$(document).ready(function(){
  var preferencesData = JSON.parse($('#preferences').val());
  var preferences = new Preferences(preferencesData);
    
  var data = JSON.parse($('#data').val());
  conversation = new Conversation(data, preferences);

  ko.applyBindings(conversation);
    
  $('#newMessage').focus();
  $('#btn-new-thread').click(toggleNewThread);

  conversation.scrollMainThread();
  conversation.scrollSubThreads();

  $(".nano").nanoScroller();

  socket.emit('open_conversation', { conversationId: conversation.id });
});

function toggleNewThread(){
  $('#newThread').slideToggle();
}
