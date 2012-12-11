function createViewModel(conversationsData, desktopData) {
  var self = {};
  
  self.conversations = ko.observableArray([]);
  for(var i = 0; i < conversationsData.length; i++){
    self.conversations.push(createConversation(conversationsData[i]));
  }

  self.desktop = createDesktop(desktopData, self.conversations());

  socket.on('conversation_added', function(data){
    var conversation = createConversation(data);
    self.conversations.push(conversation);
    self.desktop.add(conversation);
  });

  socket.on('receive_message', function(data) {
    ko.utils.arrayForEach(self.conversations(), function(conversation){
      if(data.conversationId === conversation.id){
        conversation.receiveMessage(data);
        self.adjustScrolling();
      }
    });
  });

  self.adjustScrolling = function (desktop){
    $(".nano").nanoScroller({ scroll: 'bottom' });
  }

  self.navigation = function(){
    var nav = this;

    nav.showingDesktop = ko.observable(true);

    nav.all = function(){
      nav.showingDesktop(false);
    };

    nav.desktop = function(){
      nav.showingDesktop(true);
    }

    function toggle(){
      $('#all-conversations').toggle();
      $('.desktop').toggle();
    }

    nav.newConversation = function(){
      $('#new-conversation').modal('toggle');
      setTimeout(function () { $('#new-conversation input').focus(); }, 400);
    }

    return nav;
  }();

  self.showAll = function(desktop, navigation){
    var all = this;

    all.open = function(conversation){
      navigation.desktop();
      desktop.addAndFocus(conversation);
    };

    return all;

  }(self.desktop, self.navigation);

  self.newConversation = function(desktop, navigation){
    var newConversation = this;

    newConversation.topic = ko.observable('');

    newConversation.add = function(data, event) {
      var keyCode = (event.which ? event.which : event.keyCode);
      if (keyCode === 13) {
        socket.emit('create_conversation', { topic: newConversation.topic() });
        navigation.newConversation();
        newConversation.topic('');
        return false;
      } else {
        return true;
      }
    };

    return newConversation;
  }(self.desktop, self.navigation);

  self.otherConversations = function(desktop, conversations){
    var other = this;

    other.open = function (conversation){
      desktop.addAndFocus(conversation);
    };

    other.list = ko.computed(function(){
      return conversations.filter(function(el){
        return desktop.conversations().indexOf(el) < 0;
      });
    });

    other.unreadCounter = ko.computed(function(){
      var count = 0;
      ko.utils.arrayForEach(conversations, function(conversation){
        count += conversation.unreadCounter();
      });

      return count;
    });

    other.showUnreadCounter = ko.computed(function(){
      return other.unreadCounter() > 0;
    });

    return other;
  }(self.desktop, self.conversations());

  return self;
}