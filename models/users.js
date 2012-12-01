var usersDb = [ { name: 'Carlos', id: 1 }, { name: 'Fernando', id: 2 } ];

exports.list = usersDb;

exports.find = function(id){
	for (var i = 0; i < usersDb.length; i++){
		if(usersDb[i].id == id){
			return usersDb[i];
		}
	}
};