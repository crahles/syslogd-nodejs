var connect = require('connect')
  , io = require('socket.io')
  , syslogParser = require('glossy').Parse
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
    .use(connect.logger())
    .use(connect.static(__dirname + '/../../public'));

  var ioServer = io.listen(httpServer);

  ioServer.sockets.on('connection', function (client) {
    connected_clients.push(client)
  });

  httpServer.listen(httpPort);
}

exports.write = function(syslog_line, rinfo) {

  var msg = syslogParser.parse(syslog_line);
  var date = new Date(Date.parse(msg.time));
  var ip_regex = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;

  var line = {
      "ipv"      : ((rinfo.address.search(ip_regex)>0)?'IPv4':'IPv6'),
      "date"     : date.toFormat('DD-MM-YYYY'),
      "time"     : date.toFormat('HH24:MI:SS'),
      "facility" : msg.facility,
      "severity" : msg.severity,
      "host"     : msg.host,
      "msg"      : msg.message
  }

  for (var i=0; i < connected_clients.length; i++) {
    console.log(line);
    connected_clients[i].send(JSON.stringify(line));
  };
}
