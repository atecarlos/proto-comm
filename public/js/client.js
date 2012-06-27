requirejs.config({
  baseUrl: 'js/lib',
  paths: {
    client: '../client',
    socket_io: '../../socket.io/socket.io'
  }
});

requirejs(['jquery', 'socket_io', 'client/message' ],
  function ($, message, socket_io){
    
  }
);

// fernando is not sure how the socket.io folder is created in the public folder, it seems it gets done from app.js