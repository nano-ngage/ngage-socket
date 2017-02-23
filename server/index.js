var app = require('express')();
var server = require('http').Server(app);
var fetch = require('node-fetch');
var io = require('socket.io')(server, { path: '/sockets'});
var dbip = process.env.DBIP || 'localhost';
var dbport = process.env.DBPORT || 5000;
var url = 'http://' + dbip + ':' + dbport + '/';

var port = process.env.PORT || 5500;
server.listen(port, function() {
  console.log('Server is listening on ' + port);
});

app.get('/', (req, res) => {res.end()});
var nsp = io.of('/ngage');
nsp.on('connection', function (socket) {
    socket.on('subscribe', data => {
      console.log(data.room);
      socket.join(data.room);
      socket.emit('join');
    })
    socket.on('unsubscribe', function(data) { socket.leave(data.room); })
    socket.on('start', function (data) {
      //socket.broadcast.to(data.room).emit('start');
      nsp.in(data.room).emit('start', '');
      fetch(url + 'qByS/' + data.room).then(res => res.json()).then(questions => {
        nsp.in(data.room).emit('questions', questions);
      })
    });
    socket.on('askQ', function (data) {
      fetch(url + 'aByQ/' + data.question.questionID).then(res => res.json()).then(answers => {
        nsp.in(data.room).emit('answers', {answers: answers, question: data.question});
      })
    });
    socket.on('submitResponse', data => {
      nsp.in(data.room).emit('resp', data);
      fetch(url + 'r', { method: 'POST', headers: {"Content-Type": "application/json"}, mode: 'cors',body: JSON.stringify(data) });
    });
});