var server = require('./server');

var port = process.env.PORT || 5500;
server.listen(port, function() {
  console.log('Server is listening on ' + port);
});
