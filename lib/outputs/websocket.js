var connect = require('connect')
  , io = require('socket.io')
  , parser = require('../parser')
  , d = require('date-utils');

var connected_clients = [];

exports.runServer = function(httpPort, options) {

  var httpServer = connect.createServer();

  if(
    typeof options != 'undefined' &&
    options.basicAuth &&
    options.basicAuth.user &&
    options.basicAuth.pass
  ){
    httpServer.use(connect.basicAuth(
      options.basicAuth.user, options.basicAuth.pass
    ))
  }

  httpServer
    .use(connect.favicon(__dirname + '/../../public/favicon.ico'))
    .use(connect.logger('dev'))
    .use(connect.static(__dirname + '/../../public'));

  var ioServer = io.listen(httpServer);
  ioServer.set('log level', 1); // reduce logging

  ioServer.sockets.on('connection', function (client) {
    connected_clients.push(client)
  });

  try {
    httpServer.listen(httpPort);
    console.log("Server has started.");
  } catch (e) {
    if(e.code == 'EACCES') {
      console.log('Permission to bind on port '+httpPort+' denied. Use sudo instead!');
    } else {
      console.log(e);
    }
    process.exit(1);
  }

}

exports.write = function(syslog_line, rinfo) {

  var line = {};
  var msg = parser.parse(syslog_line, rinfo);

  var line = {
      "ipv"      : msg.ipv46,
      "date"     : msg.date,
      "time"     : msg.time,
      "facility" : msg.facility,
      "severity" : msg.severity,
      "host"     : msg.host,
      "msg"      : msg.rawcontent
  }

  for (var i=0; i < connected_clients.length; i++) {
    connected_clients[i].send(JSON.stringify(line));
  };
}
