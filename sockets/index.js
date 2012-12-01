var desktopIo = require('./desktop_io')
  , conversationIo = require('./conversation_io');

exports.config = function(io, sessionStore){
    // needed for heroku
    io.configure(function () { 
      io.set("transports", ["xhr-polling"]); 
      io.set("polling duration", 10); 
    });

    // Socket connections
    io.set('authorization', function (data, accept) {
        authorize(data, accept, sessionStore);
    });

    io.sockets.on('connection', function (socket) {

      conversationIo.config(socket);

      socket.on('add_to_desktop', function(data){
        desktopIo.add(data);
      });

      socket.on('remove_from_desktop', function(data){
        desktopIo.remove(data);
      });

      socket.on('update_strip_order', function(data){
        desktopIo.updateStripOrder(data);
      });
    });
};

function authorize(data, accept, sessionStore){
	if (data.headers.cookie) {
        var cookie = require('cookie');
        data.cookie = cookie.parse(data.headers.cookie);
        data.sessionID = unescape(data.cookie['express.sid']);
        sessionStore.load(data.sessionID, function (err, session) {
            if (err || !session) {
                return accept('Error', false);
            } else {
                data.session = session;
                return accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
};