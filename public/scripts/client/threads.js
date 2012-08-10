requirejs.config({
  baseUrl: '/scripts/lib',
  paths: {
    socket_io: '../../socket.io/socket.io'
  }
});

require(["socket_io", "jquery", "knockout"],function(socket_io, $, ko){

  var socket = io.connect('http://localhost:3000');
  var conversation;

  function Message(data) {
    var self = this;

    self.content = ko.observable(data.content);
    self.timestamp = ko.observable(data.timestamp);
    self.username = ko.observable(data.username);
  }

  function Thread(data) {
    var self = this;

    self.id = data._id;
    self.title = ko.observable(data.title);
    self.newMessage = ko.observable('');

    self.sendMessage = function (data, event) {
      var keyCode = (event.which ? event.which : event.keyCode);
      if (keyCode === 13) {
        self.saveMessage();
        return false;
      } else {
        return true;
      }
    };
    
    self.messages = ko.observableArray([]);

    if(data.messages){
      for(var i = 0; i < data.messages.length; i++){
        addMessage(data.messages[i]);
      }
    }

    function addMessage(data){
      var message = new Message(data);
      self.messages.push(message);
    }

    socket.on('get_message', function(data) {
      addMessage(data);
      self.newMessage('');
    });

    self.hasMessages = ko.computed(function() {
      return self.messages().length > 0;
    });

    self.saveMessage = function(){
      var data = 
      { 
          content: self.newMessage(), 
          conversationId: conversation.id, 
          threadId: self.id,
          timestamp: new Date(),
      };

      socket.emit('post_message', data);
    };
  }

  function Conversation(data) {
    var self = this;

    self.id = data._id;
    self.mainThread = new Thread(data.threads[0]);

    self.showThreads = ko.computed(function() {
      return self.mainThread.messages().length >= 3;
    })
    
    self.newThread = ko.observable('');
    
    self.threads = ko.observableArray([]);
    
    self.askQuestionOnEnter = function (data, event) {
      var keyCode = (event.which ? event.which : event.keyCode);
      if (keyCode === 13) {
        self.askQuestion();
        return false;
      } else {
        return true;
      }
    };
      
    self.askQuestion = function() {
       socket.emit('post_thread', { title: self.newThread(), conversationId: self.id });
    };

    socket.on('thread_added', function(data){
      self.threads.push(new Thread(data));
      self.newThread('');
    });
  }

  $(document).ready(function(){
    var data = JSON.parse($('#data').val());
    conversation = new Conversation(data);
    ko.applyBindings(conversation);
    $('#newMessage').focus();

    socket.emit('open_conversation', { conversationId: conversation.id });
  });

  function getMessages(){
    var container = $(this).siblings('.json');
    container.html('');
    var threadId = container.parent().siblings('input[type=hidden]').val();

    $.getJSON('/conversations/' + conversationId + '/threads/' + threadId + '/messages.json', 
              function(data){
                for(var i=0; i<data.length; i++){
                  var inner_list = $('<ul/>', {"style": "margin-left: 15px" })
                                    .append( $('<li/>', {text: 'name: ' + data[i].name }))
                                    .append( $('<li/>', {text: 'text: ' + data[i].text }))
                                    .append( $('<li/>', {text: 'date: ' + data[i].date }));
                  
                  container.append(inner_list);
              }
    });
  }
});