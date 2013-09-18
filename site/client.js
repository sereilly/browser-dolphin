 var wiiMap = {
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
var buttonMap = wiiMap;

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
  // Show loading notice
  var canvas = document.getElementById('videoCanvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#444';
  ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

  // Setup the WebSocket connection and start the player
  var client = new WebSocket( 'ws://' + window.location.hostname + ":8084/" );
  var player = new jsmpeg(client, {canvas: canvas, autoplay: true, loop: true});
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
  $('#playerSelect').on("change", function() {
    player = $(this).val();
  });
  $('#controllerSelect').on("change", function() {
    buttonMap = $(this).val == 'Wii' ? wiiMap : gcMap;
  });
}
 