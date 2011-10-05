var parser = require('../parser')
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
  var msg = parser.parse(syslog_line, rinfo);

  str += msg.ipv46 + ' | ';
  str += msg.date + ' | ';
  str += msg.time + ' | ';
  str += msg.facility + '.' + msg.severity + ' | ';
  str += msg.host + ' | ';
  str += msg.content;


  stream.write(str + "\n");

}