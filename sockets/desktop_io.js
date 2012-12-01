var Desktop = require('../models/desktop');

exports.add = function(data){
    updateDesktop(data.id, function(desktop){
        if(desktop.conversations.indexOf(data.conversationId) < 0){
            desktop.conversations.push(data.conversationId);            
        }
    });
}

exports.remove = function(data){
    updateDesktop(data.id, function(desktop) {
        var index = desktop.conversations.indexOf(data.conversationId);
        desktop.conversations.splice(index, 1);
    });
}

exports.updateStripOrder = function(data){
    updateDesktop(data.id, function(desktop) {
        var conversation = desktop.conversations[data.currentSort.startIndex];
        desktop.conversations.splice(data.currentSort.startIndex, 1);
        desktop.conversations.splice(data.currentSort.stopIndex, 0, conversation);
    });
}

function updateDesktop(id, update){
    Desktop.findById(id, function(err, desktop){
        update(desktop);
        desktop.save();
    });
}