var dgram = require('dgram');

function start(output) {
  syslogd = dgram.createSocket("udp6", function (msg, rinfo) {
    var message = msg.toString('ascii', 0, rinfo.size);
    for (x in output) {
      output[x].write(message, rinfo)
    }
  });

  try {
    syslogd.bind(514, '0000::');
    console.log("Server has started.");
  } catch (e) {
    if(e.code == 'EACCES') {
      console.log('Permission to bind on port 514 denied. Use sudo instead!');
    } else {
      console.log(e);
    }
    process.exit(1);
  }
}

exports.start = start;


