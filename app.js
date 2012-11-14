 
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , sessionStore = new express.session.MemoryStore()
  , ioController = require('./controller/io')
  , desktopIo = require('./controller/desktop_io')
  , conversationIo = require('./controller/conversation_io')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , mongo = require('mongoose');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: sessionStore, secret: 'my secret token', key: 'express.sid' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var port = process.env.PORT || 3000;
app.listen(port);

var databaseUri = process.env.MONGOLAB_URI || 'mongodb://localhost/proto';
mongo.connect(databaseUri);

// Routes
app.get('/', routes.home);

app.post('/log-in', routes.log_in);

app.get('/conversations', routes.readConversations);

app.post('/conversations', routes.createConversation);

app.get('/conversations/:id/remove', routes.removeConversation);

// needed for heroku
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// Socket connections
io.set('authorization', function (data, accept) {
    ioController.authorize(data, accept, sessionStore);
});

io.sockets.on('connection', function (socket) {
  
  socket.on('send_message', function(data) {
    conversationIo.sendMessage(socket, data);
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
});