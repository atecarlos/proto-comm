var socket = io.connect(window.location.origin);
var conversation;

$(document).ready(function(){
  var preferencesData = JSON.parse($('#preferences').val());
  var preferences = createPreference(preferencesData);
    
  var data = JSON.parse($('#data').val());
  conversation = createConversation(data, preferences);

  ko.applyBindings(conversation);

  conversation.scrollMainThread();

  $(".nano").nanoScroller();

  $('#main-thread-new-message').focus();
  socket.emit('open_conversation', { conversationId: conversation.id });
});
