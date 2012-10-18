var socket = io.connect(window.location.origin);

$(document).ready(function(){
  /*var preferencesData = JSON.parse($('#preferences').val());
  var preferences = createPreference(preferencesData);*/
    
  var data = JSON.parse($('#data').val());
  var conversation = createConversation(data);

  ko.applyBindings(conversation);

  /*conversation.scrollMainThread();

  $(".nano").nanoScroller();*/

  $('#main-thread-new-message').focus();
  socket.emit('open_conversation', { conversationId: conversation.id });
});
