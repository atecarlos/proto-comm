var usersDb = [ { name: 'Carlos', id: 1 }, { name: 'Fernando', id: 2 } ];

exports.list = usersDb;

exports.find = function(id){
	for (var i = 0; i < usersDb.length; i++){
		if(usersDb[i].id == id){
			return usersDb[i];
		}
	}
};

exports.allExcept = function(exceptions){
	var userIds = [];
	for (var i = 0; i < usersDb.length; i++){
		if(exceptions.indexOf(usersDb[i].id) == -1){
			userIds.push(usersDb[i].id);
		}
	}

	return userIds;
};