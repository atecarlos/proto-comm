function createPreference(data){
  var self = {};

  self.getPreferenceFor = function(threadId){
    for(var i = 0; i < data.length; i++){
      if(data[i].threadId == threadId){
        return data[i];
      }
    }
  };

  return self;
}