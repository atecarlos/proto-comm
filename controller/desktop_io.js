var Desktop = require('../models/desktop');

exports.addToStrip = function(socket, data){
    updateDesktop(socket, function(desktop){
        if(desktop.strip.indexOf(data.conversationId) < 0){
            desktop.strip.push(data.conversationId);            
        }
    });
}

exports.removeFromStrip = function(socket, data){
    updateDesktop(socket, function(desktop) {
        var index = desktop.strip.indexOf(data.conversationId);
        desktop.strip.splice(index, 1);
    });
}

exports.addToActive = function(socket, data){
    updateDesktop(socket, function(desktop){
        if(desktop.active.indexOf(data.conversationId) < 0){
            desktop.active.push(data.conversationId);
        }
    });
}

function updateDesktop(socket, update){
    Desktop.findOne( { userId: socket.handshake.session.user.id }, function(err, desktop){
        update(desktop);
        desktop.save();
    });
}