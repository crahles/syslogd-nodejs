var buffer = require('buffer');
var dgram = require('dgram');
var socket_4 = dgram.createSocket("udp4");
var socket_6 = dgram.createSocket("udp6");

var syslogProducer = require('glossy').Produce;
var logger = new syslogProducer({ type: 'BSD'});

function randomValue( min, max ) {
  if( min > max ) {
    return( -1 );
  }
  if( min == max ) {
    return( min );
  }

  return( min + parseInt( Math.random() * ( max-min+1 ) ) );
}

function sendRandomMessage(i) {
  var msg = logger.produce({
    facility: 'local'+randomValue(0,6),
    severity: 'error',
    host: 'localhost',
    app_id: 'sudo',
    pid: randomValue(0,99999),
    date: new Date(Date()),
    message: 'Nice, Neat, New, Oh Wow'
  });


  return msg;

}

for (i=0;i<=200;i++)
{

  var msg = sendRandomMessage(i);
  var buffer = new Buffer(msg);
  socket_4.send(buffer, 0, buffer.length, 514, "localhost");
  var msg = sendRandomMessage(i);
  var buffer = new Buffer(msg);
  socket_6.send(buffer, 0, buffer.length, 514, "localhost");

}
socket_4.close();
socket_6.close();


