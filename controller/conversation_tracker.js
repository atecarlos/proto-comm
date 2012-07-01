var map = {};

exports.addUserToConversation = function(socketId, conversationId){
	if(!map[conversationId]){
		map[conversationId] = [socketId];
	}else{
		map[conversationId].push(socketId);
	}
}

exports.getUsersIn = function(conversationId){
	return map[conversationId];
}

exports.removeUserFromAllConversations = function(socketId){
	console.log('removing from conversations');
	for(var conversationId in map){
		removeUserFromConversation(socketId, conversationId);
	}
}

function removeUserFromConversation(socketId, conversationId){
	var index = map[conversationId].indexOf(socketId);
	map[conversationId].splice(index, 1);
}