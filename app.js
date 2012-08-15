 
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , sessionStore = new express.session.MemoryStore()
  , ioController = require('./controller/io')
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

mongo.connect('mongodb://localhost/proto');

// Routes
app.get('/', routes.index);

app.post('/log-in', routes.log_in);

app.get('/conversations/:id/threads', routes.openConversation);

app.get('/conversations', routes.getConversations);

app.post('/conversations', routes.postConversation);

// Services
app.get('/conversations/:id/threads/:threadId/messages.json', routes.getMessages);

// Socket connections
io.set('authorization', function (data, accept) {
    ioController.authorize(data, accept, sessionStore);
});

io.sockets.on('connection', function (socket) {
  
  socket.on('post_message', function(data) {
    ioController.postMessage(socket, data, io.sockets);
  });

  socket.on('open_conversation', function(data){
    ioController.openConversation(socket, data);
  });

  socket.on('post_thread', function(data){
    ioController.addThread(socket, data, io.sockets);
  });

  socket.on('disconnect', function(){
    ioController.disconnect(socket);
  });

});