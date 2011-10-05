var parser = require('../parser');

exports.write = function(syslog_line, rinfo) {

  var str = '';
  var msg = parser.parse(syslog_line, rinfo);

  str += msg.ipv46 + ' | ';
  str += msg.date + ' | ';
  str += msg.time + ' | ';
  str += msg.facility + '.' + msg.severity + ' | ';
  str += msg.host + ' | ';
  str += msg.content;

  console.log(str);
}