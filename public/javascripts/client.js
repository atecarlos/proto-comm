var socket = io.connect('http://localhost:3000');

socket.on('new_message', function(data) {
  	addNewMessage(data.msg);
});

function addNewMessage(msg){
	$('#messages').append($('<li>').append(msg));
}

$(document).ready(function(){
	$('#btnSubmit').click(function(){
		var msg = $('#txtBoxMessage').val();
		socket.emit('post', { msg: msg });
		addNewMessage(msg);
	});
});