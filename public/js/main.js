var socket = io.connect('http://localhost');
socket.on('message', function (line) {
  var row = "";
  $.each($.parseJSON(line), function(index, value) {
    row += "<td>" + value + "</td>";
  });
  $('#syslog > tbody:first').prepend("<tr>"+row+"</tr>");
  $("#syslog > tbody:first tr:gt(99)").remove();
});