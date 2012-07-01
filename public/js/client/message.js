define(["socket_io", "jquery"],function(socket_io, $){

  var socket = io.connect('http://localhost:3000'),
      conversationId = $('#hdnConversationId').val();

  socket.on('new_message', function(data) {
    	addNewMessage(data);
  });

  $(document).ready(function(){
  	$('#btnSubmit').click(emitMessage);
	
  	$('#txtBoxMessage').keyup(function(event) {
  	  if (event.which === 13) {
  	    emitMessage();
  	  }
  	});

    socket.emit('open_conversation', { conversationId: conversationId });

  });

  function emitMessage(){
    var name = $('#hdnName').val();
    var txtBox = $('#txtBoxMessage');
    var text = txtBox.val();
    txtBox.val('');
    socket.emit('post', { msg: text, conversationId: conversationId });
  }

  function addNewMessage(data){
  	var template = $('#messages > div.template > div.message');
  	template.children('span.name').html(data.name);
  	template.children('span.text').html(data.text);
  	template.clone().appendTo('#messages').hide().show('medium');
  }

});