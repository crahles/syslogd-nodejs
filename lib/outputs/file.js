var syslogParser = require('glossy').Parse
  , events = require('events')
  , fs = require('fs')
  , d = require('date-utils');

var file;
var stream;

exports.openFile = function(filename) {
  file = filename;
  stream = fs.createWriteStream(file,
    {flags: 'a', mode: 0644, encoding: 'utf8'}
  )

  fs.watchFile(file, function (curr, prev) {
    if (curr.nlink == 0) {
      stream = fs.createWriteStream(file,
        {flags: 'a', mode: 0644, encoding: 'utf8'}
      )
    }
  });
}

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


  stream.write(str + "\n");

}