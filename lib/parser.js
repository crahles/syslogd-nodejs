require('date-utils')

var severity = [
   "Emergency"
  , "Alert"
  , "Critical"
  , "Error"
  , "Warning"
  , "Notice"
  , "Informational"
  , "Debug"
];

var facility = [
    "kernel messages"
  , "user-level messages"
  , "mail system"
  , "system daemons"
  , "security/authorization messages"
  , "messages generated internally by syslogd"
  , "line printer subsystem"
  , "network news subsystem"
  , "UUCP subsystem"
  , "clock daemon"
  , "security/authorization messages"
  , "FTP daemon"
  , "NTP subsystem"
  , "Log audit"
  , "Log alert"
  , "Clock daemon"
  , "Local0"
  , "Local1"
  , "Local2"
  , "Local3"
  , "Local4"
  , "Local5"
  , "Local6"
  , "Local7"
];

exports.parse = function(message, rinfo) {

  var result = {
      "original": message
    , "ipv46": "N/A"
    , "date": "N/A"
    , "time": "N/A"
    , "pri": -1
    , "facility_id": -1
    , "facility": "N/A"
    , "severity_id": -1
    , "severity": "N/A"
    , "host": "N/A"
    , "pid": ""
    , "content": ""
    , "rawcontent": ""
  };

  // preserve original message
  result.original = message;

  var ip_regex = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
  if (rinfo != undefined)
    result.ipv46 = ((rinfo.address.search(ip_regex)>0)?'IPv4':'IPv6');

  var vcharExp = new RegExp("[a-zA-Z0-9 \t\/]");
  var partStart = -1, partEnd = -1;
  partStart = message.indexOf('<');

  if (partStart > -1) {
    partEnd = message.indexOf('>', partEnd);
    if (partEnd > -1) {
      result.pri = parseInt(message.substring(partStart+1, partEnd));

      // decode pri part into facility# and severity
      result.severity_id = result.pri % 8;
      result.facility_id = (result.pri - result.severity_id) / 8;

      // lookup facility identifier
      result.facility = facility[result.facility_id];
      // lookup textual description for severity
      result.severity = severity[result.severity_id];

      // seperate content, tag and optionally pid
      msg = message.substr(partEnd + 1).removeDblWhitespace().trimString().split(' ');

      string_date = msg.shift() + ' ' + msg.shift() + ' ' + msg.shift();
      var date = new Date(Date.parse(string_date));
      result.date = date.toFormat('DD-MM-YYYY')
      result.time = date.toFormat('HH24:MI:SS')

      result.host = msg.shift();

      msg = msg.join(' ').trimString();
      result.rawcontent = msg;

      if (msg.substr(0, 1) == "[") {
        partEnd = msg.indexOf("]");
        if (partEnd > -1) {
          result.pid = msg.substring(1, partEnd);
          result.content = msg.substr(partEnd + 1);
        } else {
          result.content = msg;
        }
      } else {
        result.content = msg;
      }

      // remove ":", ": " at the start and "\n" at the end
      if (result.content.substr(0, 1) == ":") {
        result.content = result.content.substr(1);
        if (result.content.substr(0, 1) == " ")
        result.content = result.content.substr(1);
      }
      if (result.content.substr(result.content.length - 1, 1) == "\n")
      result.content = result.content.substr(0, result.content.length - 1);
    }
  }

  return result;
}

String.prototype.trimString = function() {
  return this.replace(/\s+/, " ");
}

String.prototype.removeDblWhitespace = function() {
  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
