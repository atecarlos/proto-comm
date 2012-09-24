function createMessage(data) {
  var self = {};

  self.content = ko.observable(data.content);
  self.timestamp = formatTimestamp(data.timestamp);
  self.username = data.user.name;

  function formatTimestamp(timestamp) {
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    return month + '/' + day + ' ' + hour + ':' + minute;
  }

  return self;
}