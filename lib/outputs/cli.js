var syslogParser = require('glossy').Parse
  , d = require('date-utils');

exports.write = function(syslog_line, rinfo) {

  var str = '';
  var msg = syslogParser.parse(syslog_line);
  var date = new Date(Date.parse(msg.time));
  var ip_regex = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;

  str += ((rinfo.address.search(ip_regex)>0)?'IPv4':'IPv6') + ' | ';
  str += date.toFormat('DD-MM-YYYY') + ' | ';
  str += date.toFormat('HH24:MI:SS') + ' | ';
  str += msg.facility + '.' + msg.severity + ' | ';
  str += msg.host + ' | ';
  str += msg.message;

  console.log(str);
}