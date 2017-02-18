var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var port = process.env.PORT || 5500;
server.listen(port, function() {
  console.log('Server is listening on ' + port);
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('roomcode', function (data) {
    console.log(data);
    socket.emit('setAnswer', [1,2,3,4]);
  });
});