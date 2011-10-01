$(function(){
  syslog = Syslogd();
  syslog.connect();

  $('#pauseLog').click(function(){
    $(this).toggleClass("toggle");
    $(this).toggleClass("danger");
  });

  $('#clearFilter').click(function(){
    $('#filter').attr('value','');
  });
});


var Syslogd = function(){
  var me = {};
  var socket;

  me.connect = function(){
    var host = window.location.host.split(":")[0];
    var port = (window.location.port == '')?':80':':'+window.location.port;
    var proto = window.location.protocol;

    socket = io.connect(proto+'//'+host+port);
    socket.on('message', function(data){
      refreshTable(data);
    });
  }

  function refreshTable(data) {
    var json = jQuery.parseJSON(data);

    if (!logIsPaused()) {
      var filter = getFilterValue();

      if (!filterEmpty(filter) && dataMatchingFilter(data)) {
        writeLine(json);
      } else if (filterEmpty(filter)) {
        writeLine(json);
      }
      trimLines(99);
    }
  }


  function getFilterValue() {
    return $('#filter').attr('value') == undefined ? '' : $('#filter').attr('value');
  }

  function logIsPaused() {
    return $('#pauseLog').hasClass('toggle');
  }

  function filterEmpty(filterValue) {
    return filter == '' ? true : false;
  }

  function dataMatchingFilter(data) {
    return data.search(eval("/"+$('#filter').attr('value')+"/i")) != -1
  }

  function writeLine(json) {
    var row = "";
    $.each(json, function(index, value) {
      row += "<td>" + value + "</td>";
    });
    $('#syslog > tbody:first').prepend("<tr>"+row+"</tr>");
  }

  function trimLines(maxRows) {
    $('#syslog > tbody:first tr:gt('+maxRows+')').remove();
  }

  return me;
}


