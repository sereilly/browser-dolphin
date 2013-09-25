 var wiiMap = {
  65:2, // left
  68:1, // right
  87:4, // up
  83:8, // down
  69:2048, // A
  81:1024, // B
  13:32768, // home
  75:512, // 1
  76:256, // 2
  187:16, // +
  189:4096 // -
 };
 
  var wiiMapSide = {
  65:8, // left
  68:4, // right
  87:2, // up
  83:1, // down
  69:2048, // A
  81:1024, // B
  13:32768, // home
  75:512, // 1
  76:256, // 2
  187:16, // +
  189:4096 // -
 };
 
 var gcMap = {
  65:0x0001, // left
  68:0x0002, // right
  87:0x0008, // up
  83:0x0004, // down
  69:0x0040, // L
  81:0x0020, // R
  13:0x1000, // start
  75:0x200, // B
  76:0x100, // A
  187:0x400, // X
  189:0x800, // Y
  190:0x010 // Z
 };

var socket;
var buttons = 0;
var player = 1;
var buttonMap = wiiMapSide;

$(document).ready(function() {
  InitMessaging();
  InitPlayer();
  InitMouseTracking();
  InitKeyboardTracking();
  InitDropdowns();
 });
 
 function InitMessaging()
 {
  socket = io.connect();
	var messageField = $('#messageField');
	var sendBtn = $('#sendBtn');
	sendBtn.click(function() {
		if (messageField.val().length > 0) {
			var message = messageField.val();
			socket.send(message);
			messageField.val('');
		}
	});
}
 
 function InitPlayer()
 {

$f("live", "http://releases.flowplayer.org/swf/flowplayer-3.2.16.swf", {
 
    clip: {
        url: 'test',
        live: true,
        // configure clip to use influxis as our provider, it uses our rtmp plugin
        provider: 'influxis',
        bufferLength : 0, 
        autoPlay: true
    },
 
    // streaming plugins are configured under the plugins node
    plugins: {
 
        // here is our rtpm plugin configuration
        influxis: {
            url: "flowplayer.rtmp-3.2.12.swf",
 
            // netConnectionUrl defines where the streams are found
            netConnectionUrl: 'rtmp://' + window.location.hostname + ':1935/live'
        }
    }
});

 }
 
 function convertCoords(event)
 {
  if (event.offsetX === undefined)
  {
    var canvasOffset = $('#videoCanvas').offset();
    event.offsetX = event.pageX - canvasOffset.left;
    event.offsetY = event.pageY - canvasOffset.top;
  }
  event.offsetX = event.offsetX / 640.0 * 2 - 1;
  event.offsetY = event.offsetY / 480.0 * 2 - 1;
 }
 
 function InitMouseTracking()
 {
  // TODO: Mouse tracking for all
  $("#videoCanvas").mousemove(function(event) {
    if (player != 1)
      return;
    convertCoords(event);
    socket.send(player + " m " + event.offsetX + " " + event.offsetY);
  });
  $("#videoCanvas").mousedown(function(event) {
    convertCoords(event);
    //socket.send("c " + event.offsetX + " " + event.offsetY);
  });
 }
 
function InitKeyboardTracking()
{
  $(window).keydown(function(event){
    console.log(event.keyCode);
    buttons =  buttons | buttonMap[event.keyCode];
    socket.send(player + " k " + buttons);
  }); 
  $(window).keyup(function(event){
    buttons = buttons & ~buttonMap[event.keyCode];
    socket.send(player + " k " + buttons);
  }); 
}

function InitDropdowns()
{
  /*$('#playerSelect').on("change", function() {
    player = $(this).val();
  });
  $('#controllerSelect').on("change", function() {
    switch($(this).val())
    {
      case 'Wii':
      buttonMap = wiiMap;
      break;
      case 'WiiSide':
      buttonMap = wiiMapSide;
      break;
      case 'Gamecube':
      buttonMap = gcMap;
      break;
      default:
      buttonMap = wiiMap;
    }
  });*/
 $(".games li a").click(function(){
    var gameid = this.attr("data-gameid");
    alert(gameid);
 });
}
 