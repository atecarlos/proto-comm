
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , sessionStore = new express.session.MemoryStore()
  , ioController = require('./controller/io_controller');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

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

app.listen(3000);

// Routes
app.get('/', routes.index);

app.post('/log-in', routes.log_in);

app.get('/messages', routes.get_messages);

// socket connections

io.set('authorization', function (data, accept) {
    ioController.authorize(data, accept, sessionStore);
});

io.sockets.on('connection', function (socket) {
  socket.on('post', function(data) {
    ioController.post(socket, data);
  });
});


