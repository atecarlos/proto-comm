requirejs.config({
  baseUrl: '/scripts/lib',
  paths: {
    socket_io: '../../socket.io/socket.io'
  }
});

require(["socket_io", "jquery", "knockout", "bootstrap"],function(socket_io, $, ko, bootstrap){

  function Message(content) {
    var self = this;

    self.content = ko.observable(content);
    self.timestamp = ko.observable(getTimestamp());
    self.username = ko.observable(getUsername());

    function getTimestamp() {
      var now = new Date();
      return now.getHours() + ':' + now.getMinutes();
    }

    function getUsername() {
      var now = new Date();
      if ((now.getSeconds() % 2) === 1) {
        return 'Fernando Trigoso';
      } else {
        return 'Carlos Atencio';
      }    
    }
  }

  function Thread(title) {
    var self = this;

    self.title = ko.observable(title);
    self.newMessage = ko.observable('');

    self.sendMessage = function (data, event) {
      var keyCode = (event.which ? event.which : event.keyCode);
      if (keyCode === 13) {
        self.messages.push(new Message(self.newMessage()));
        self.newMessage('');
        return false;
      } else {
        return true;
      }
    };
    
    self.messages = ko.observableArray([]);

    self.hasMessages = ko.computed(function() {
      return self.messages().length > 0;
    });
  }

  function AppViewModel() {
    var self = this;

    self.mainThread = new Thread('Financial Reports');

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
       self.threads.push(new Thread(self.newThread()));
       self.newThread('');        
    };
  }

  var socket = io.connect('http://localhost:3000'),
      conversationId = $('#hdnConversationId').val();


  $(document).ready(function(){
    ko.applyBindings(new AppViewModel());
    $('#newMessage').focus();

    $('#btnAddThread').click(addThread);

    $('.thread .message-input input').keyup(function(event) {
      if (event.which === 13) {
        var txtBox = $(this);
        if(txtBox.val() !== ''){
          emitMessage($(this));
        }
      }
    });

    socket.emit('open_conversation', { conversationId: conversationId });

    $('.thread button.btnGetMessages').click(getMessages);
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

  function addThread(){
    socket.emit('new_thread', { conversationId: conversationId });
  }

  socket.on('thread_added', function(data){
    alert('thread added with id: ' + data.id);
  });

  function emitMessage(txtBox){
    var name = $('#hdnName').val();
    var threadId = txtBox.parent().siblings('input[type=hidden]').val();
    var text = txtBox.val();
    txtBox.val('');
    socket.emit('post', { msg: text, conversationId: conversationId, threadId: threadId });
  }

  socket.on('new_message', function(data) {
      addNewMessage(data);
  });

  function addNewMessage(data){
    var messages = $('input[id=' + data.threadId + ']').siblings('div.messages');
  	var template = messages.find('div.template > div.message');
  	template.children('span.name').html(data.name);
  	template.children('span.text').html(data.text);
  	template.clone().appendTo(messages).hide().show('medium');
  }
});