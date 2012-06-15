
/**
 * Module dependencies.
 */

var express = require('express')
  , model = require('./models')
  , sessionStore = new express.session.MemoryStore();

var sessionSecret = 'my secret token';

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: sessionStore, secret: sessionSecret, key: 'express.sid' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Routes
app.get('/', function(req, res){
  res.render('index', { title: 'my chat app' });
});

app.post('/log-in', function(req, res){
  var name = req.body.name;
  req.session.name = name;
  console.log('my name is');
  console.log(req.session.name);
  res.redirect('/messages');
});

app.get('/messages', function(req, res){
  model.find(function(err, lMessages){
    messages = lMessages;
    title = 'my chat app';
    res.render('messages');
  });
});

// socket connections

io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        var cookie = require('cookie');
        data.cookie = cookie.parse(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
        sessionStore.load(data.sessionID, function (err, session) {
            if (err || !session) {
                console.log('error getting session');
                // if we cannot grab a session, turn down the connection
                return accept('Error', false);
            } else {
                console.log('success getting session');
                data.session = session;
                return accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});

io.sockets.on('connection', function (socket) {
  socket.on('post', function(data) {
    console.log('my name on save is')
    console.log(socket.handshake.session.name);
    var msg = new model();
    msg.text = data.msg;
    msg.name = socket.handshake.session.name;
    msg.save();
    socket.broadcast.emit('new_message', data);
  });
});


