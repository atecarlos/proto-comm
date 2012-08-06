requirejs.config({
  baseUrl: '/scripts/lib',
  paths: {
    socket_io: '../../socket.io/socket.io'
  }
});

require(["socket_io", "jquery", "knockout"],function(socket_io, $, ko){

  var socket = io.connect('http://localhost:3000'),
      conversationId = $('#hdnConversationId').val();


  $(document).ready(function(){

    $('.thread button.btnGetMessages').click(getMessages);

    $('.thread .message-input input').keyup(function(event) {
      if (event.which === 13) {
        var txtBox = $(this);
        if(txtBox.val() !== ''){
          emitMessage($(this));
        }
      }
    });

    socket.emit('open_conversation', { conversationId: conversationId });
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