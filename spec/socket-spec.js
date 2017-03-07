var io = require('socket.io-client');
var app = require('../server/server.js');
var expect = require('chai').expect;
var socketURL = 'http://localhost:4568/ngage';

var options ={
  transports: ['websocket'],
  'force new connection': true,
  'path': '/sockets'
};

describe("Chat Server",function(){
  var server;
  var client1, client2;

  before(function() {
    server = app.listen(4568, function() {
      console.log('Server is listening on 4568');
    });
    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);
  });

  after(function() {
    server.close();
  });

  it('Should broadcast new user to all users', function(done){
    this.timeout(5000);
    client1.emit('subscribe', {room: 'channel'});
    client1.on('join', data => {
      client2.emit('subscribe', {room: 'channel'});
      client2.on('join', data => {
        client1.emit('start', {room: 'channel'});
        client2.on('start', data => {
          done();
        })
      })
    })
  });

  it('Should receive askQ socket and receive a server is unavailable message', function(done){
    this.timeout(5000);
    client1.emit('askQ', {question: {questionID:5}});
    client1.on('answers', data => {
      expect(data).to.equal('Server is unavailable');
      done();
    })
  });

  it('Should receive showA socket and receive a server is unavailable message', function(done){
    this.timeout(5000);
    client1.emit('showA', {questionID:5});
    client1.on('correct', data => {
      expect(data).to.equal('Server is unavailable to get correct answer');
      done();
    })
  });

  it('Should receive submitResponse socket and receive a server is unavailable message', function(done){
    this.timeout(5000);
    client1.emit('submitResponse', 'Test Data');
    client1.on('responseSubmit', data => {
      expect(data).to.equal('Server is unavailable');
      done();
    })
  });

  it('Should receive submitAudQuestion socket and receive a server is unavailable message', function(done) {
    this.timeout(5000);
    client1.emit('submitAudQuestion', 'Is this an awesome question?');
    client1.on('audQuestionSubmit', data => {
      expect(data).to.equal('Server is unavailable');
      done();
    });
  });
});
