var app = require('express')();
var server = require('http').Server(app);
var fetch = require('node-fetch');
var io = require('socket.io')(server, { path: '/sockets'});
var url = 'http://localhost:5000/';

var port = process.env.PORT || 5500;
server.listen(port, function() {
  console.log('Server is listening on ' + port);
});

var nsp = io.of('/ngage');
nsp.on('connection', function (socket) {
    socket.on('subscribe', data => { 
      socket.join(data.room); 
    })
    socket.on('unsubscribe', function(data) { socket.leave(data.room); })
    socket.on('start', function (data) {
      socket.broadcast.to(data.room).emit('start');
      fetch(url + 'qBySocket/' + data.room).then(res => res.json()).then(questions => {
        nsp.in(data.room).emit('questions', questions);
      })
    });
    socket.on('askQ', function (data) {
      fetch(url + 'aByQ/' + data.question.questionID).then(res => res.json()).then(answers => {
        nsp.in(data.room).emit('answers', {answers: answers, question: data.question});
      })
    });
    socket.on('submitResponse', data => {
      fetch('http://localhost:5000/rPost', { method: 'POST', headers: {"Content-Type": "application/json"}, mode: 'cors',body: data });
    });
});