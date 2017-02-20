var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, { path: '/sockets'});


var port = process.env.PORT || 5500;
server.listen(port, function() {
  console.log('Server is listening on ' + port);
});

//ABC will be the room code we will generate
var nsp = io.of('/ngage');
nsp.on('connection', function (socket) {

    socket.on('subscribe', data => { 
      socket.join(data.room); 
    })

    socket.on('unsubscribe', function(data) { socket.leave(data.room); })


    socket.on('start', function (data) {
      socket.broadcast.to(data.room).emit('start');
      //socket.to(data.room).emit('questions', [{id:1, question:'What is your name?'},{id:2, question:'How old are you?'}]);
      nsp.in(data.room).emit('questions', [{id:1, question:'What is your name?'},{id:2, question:'How old are you?'}]);
      
      //nsp.in(data.room).emit('setRoom', [1,2,3,4]);
    });
    socket.on('askq', function (data) {
      var answers = [];
      answers[0] = [{id:1, answer:'Saivickna'},{id:2, answer:'Patrick'},{id:3, answer:'Sunnie'},{id:4, answer:'Jordan'}];
      answers[1] = [{id:5, answer:'20'},{id:6, answer:'21'},{id:7, answer:'22'},{id:8, answer:'23'}];
      //socket.broadcast.to(data.room).emit('answers', answers[data.qID-1]);
      nsp.in(data.room).emit('answers', answers[data.qID-1]);
    })
});




// io.on('connection', function (socket) {
//   socket.on('session', function (data) {
//     console.log(data);
//     socket.to('setRoom').emit([1,2,3,4]);
//   });
// });