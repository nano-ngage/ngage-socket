var app = require('express')();
var server = require('http').Server(app);
var fetch = require('node-fetch');
var io = require('socket.io')(server, { path: '/sockets'});
var dbip = process.env.DBIP || 'localhost';
var dbport = process.env.DBPORT || 5000;
var url = 'http://' + dbip + ':' + dbport + '/';

var fetchOptions = require('./helpers').fetchOptions;

app.get('/', (req, res) => {res.end()});

function handleErrors(response) {
    console.log('handleErrors', response);
    if (!response.ok) {
        console.log('status', response.statusText);
        throw Error(response.statusText);
    }
    return response;
}

var nsp = io.of('/ngage');
nsp.on('connection', function (socket) {
  socket.on('subscribe', data => {
    socket.join(data.room);
    socket.emit('join');
  });

  socket.on('unsubscribe', function(data) { socket.leave(data.room); })

  socket.on('start', function (data) {
    nsp.in(data.room).emit('start', '');

    fetch(url + 'qByS/' + data.room)
      .then(res => res.json())
      .then(questions => { nsp.in(data.room).emit('questions', questions); })
      .catch (e => { socket.emit('questions', 'Server is unavailable'); });
  });

  socket.on('askQ', function (data) {
    fetch(url + 'aByQ/' + data.question.questionID)
      .then(handleErrors)
      .then(res => res.json())
      .then(answers => { nsp.in(data.room).emit('answers', {answers: answers, question: data.question}); })
      .catch(e => { socket.emit('answers', 'Server is unavailable'); })
  });

  socket.on('showA', function(data) {
    fetch(url + 'aByCorrect/' + data.questionID)
    .then(handleErrors)
    .then(res => res.json())
    .then(correct => {nsp.in(data.room).emit('correct', {
      correct: correct
    })})
    .catch(e => {socket.emit('correct', 'Server is unavailable to get correct answer')})
  });

  socket.on('submitResponse', data => {
    nsp.in(data.room).emit('resp', data);
    var options = fetchOptions('POST', data);

    fetch(url + 'r', options)
      .catch(e => { socket.emit('responseSubmit', 'Server is unavailable'); });
  });

  socket.on('submitAudQuestion', data => {

    var options = fetchOptions('POST', data);
    fetch(url + 'aqByS/', options)
      .then(handleErrors)
      .then(res => res.json())
      .then(audQuestion => { nsp.in(data.room).emit('audquestions', audQuestion); })
      .catch(err => { socket.emit('audQuestionSubmit', 'Server is unavailable'); });
  })

  socket.on('upvoteAudQuestion', data => {
    nsp.in(data.room).emit('upvote', data.audQuestionID);
    var options = fetchOptions('PUT', data);

    fetch(url + 'aq/' + data.audQuestionID, options)
      .catch(err => { socket.emit('audQuestionUpvote', 'Server is unavailable'); });
  })
});

module.exports = server;
