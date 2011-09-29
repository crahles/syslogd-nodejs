var syslogParser = require('glossy').Parse
  , d = require('date-utils')
  , ip_version = require('../helper/ip_version');

function write(syslog_line, rinfo) {

  var str = '';
  var msg = syslogParser.parse(syslog_line);
  var date = new Date(Date.parse(msg.time));

  str += ip_version.get(rinfo.address) + ' | ';
  str += date.toFormat('DD-MM-YYYY') + ' | ';
  str += date.toFormat('HH24:MI:SS') + ' | ';
  str += msg.facility + '.' + msg.severity + ' | ';
  str += msg.host + ' | ';
  str += msg.message;

  console.log(str);
}

exports.write = write;