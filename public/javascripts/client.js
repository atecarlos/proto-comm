var socket = io.connect('http://localhost:3000');

socket.on('new_message', function(data) {
  	addNewMessage(data);
});

$(document).ready(function(){
	$('#btnSubmit').click(function(){
		var name = $('#hdnName').val();
		var txtBox = $('#txtBoxMessage');
		var text = txtBox.val();
		txtBox.val('');
		socket.emit('post', { msg: text });
		addNewMessage({ text: text, name: name });
	});
});

function addNewMessage(data){
	var template = $('#messages > div.template > div.message');
	template.children('span.name').html(data.name);
	template.children('span.text').html(data.text);
	template.clone().appendTo('#messages');
}