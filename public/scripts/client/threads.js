var socket = io.connect(window.location.origin);
var conversation;

$(document).ready(function(){
  var preferencesData = JSON.parse($('#preferences').val());
  var preferences = createPreference(preferencesData);
    
  var data = JSON.parse($('#data').val());
  conversation = createConversation(data, preferences);

  ko.applyBindings(conversation);
    
  $('#newMessage').focus();
  $('#btn-new-thread').click(toggleNewThread);

  conversation.scrollMainThread();
  conversation.scrollSubThreads();

  $(".nano").nanoScroller();

  socket.emit('open_conversation', { conversationId: conversation.id });
});

function toggleNewThread(){
  $('#newThread').modal('toggle') 
}
