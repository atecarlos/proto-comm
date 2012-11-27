exports.authorize = function(data, accept, sessionStore){
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

exports.addToActiveUsers = function(socket){
    if(activeUsers.indexOf(socket.handshake.session.user.id) < 0){
        activeUsers.push(socket.handshake.session.user.id);
    }
    printActiveUsers();
};

exports.removeFromActiveUsers = function(socket){
    var indexToRemove = activeUsers.indexOf(socket.handshake.session.user.id);
    activeUsers.splice(indexToRemove, 1);
    printActiveUsers();
};

function printActiveUsers(){
    console.log('****active users:*****');
    for(var i = 0; i < activeUsers.length; i++){
        console.log('*' + activeUsers[i]);
    }
}

exports.getActiveUsers = function(){
    return activeUsers;
};