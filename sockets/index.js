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
      
      addToActiveUsers(socket);

      socket.on('send_message', function(data) {
        printActiveUsers();
        conversationIo.sendMessage(socket, data, activeUsers);
      });

      socket.on('create_conversation', function(data){
        conversationIo.createConversation(socket, data);
      });

      socket.on('add_to_desktop', function(data){
        desktopIo.add(socket, data);
      });

      socket.on('remove_from_desktop', function(data){
        desktopIo.remove(socket, data);
      });

      socket.on('change_index', function(data){
        desktopIo.changeIndex(socket, data);
      });

      socket.on('remove_active_user', function(){
        removeFromActiveUsers(socket);
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

var activeUsers = [];

function addToActiveUsers(socket){
    if(activeUsers.indexOf(socket.handshake.session.user.id) < 0){
        activeUsers.push(socket.handshake.session.user.id);
    }
};

function removeFromActiveUsers(socket){
    var indexToRemove = activeUsers.indexOf(socket.handshake.session.user.id);
    activeUsers.splice(indexToRemove, 1);
};

function printActiveUsers(){
    console.log('****active users:*****');
    for(var i = 0; i < activeUsers.length; i++){
        console.log('*' + activeUsers[i]);
    }
}

function getActiveUsers(){
    return activeUsers;
};