var socket = io.connect(window.location.origin);

$(document).ready(function(){
  /*var preferencesData = JSON.parse($('#preferences').val());
  var preferences = createPreference(preferencesData);*/
    
  var data = JSON.parse($('#data').val());
  var viewModel = createViewModel(data);

  ko.applyBindings(viewModel);

  viewModel.adjustScrolling();
});
