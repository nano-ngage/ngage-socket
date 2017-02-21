var io = require('socket.io-client');

var socketURL = 'http://localhost:5500/ngage';

var options ={
  transports: ['websocket'],
  'force new connection': true,
  'path': '/sockets'
};

describe("Chat Server",function(){
  it('Should broadcast new user to all users', function(done){
    this.timeout(5000);
    var client1 = io.connect(socketURL, options);
    client1.emit('subscribe', {room: 'channel'});
    client1.on('join', data => {
      var client2 = io.connect(socketURL, options);
      client2.emit('subscribe', {room: 'channel'});   
      client2.on('join', data => {
        client1.emit('start', {room: 'channel'});
        client2.on('start', data => {
          done();
        })
      })   
    })
  });
});