var socket = io.connect(window.location.origin);

$(document).ready(function(){
  var desktopData = JSON.parse($('#desktop').val());
  var conversationData = JSON.parse($('#data').val());
  
  var viewModel = createViewModel(conversationData, desktopData);

  ko.applyBindings(viewModel);

  viewModel.adjustScrolling();
  viewModel.desktop.setupSorting();

  window.onbeforeunload = function() { socket.emit('remove_active_user'); }; // for chrome
});

// non chrome browsers
$(window).unload(function(){
  	socket.emit('remove_active_user');
});
