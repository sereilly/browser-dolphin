var socket;
var buttons = 0;

$(document).ready(function() {
  InitMessaging();
  InitPlayer();
  InitMouseTracking();
  InitKeyboardTracking();
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
  $("#videoCanvas").mousemove(function(event) {
    convertCoords(event);
    socket.send("m " + event.offsetX + " " + event.offsetY);
  });
  $("#videoCanvas").mousedown(function(event) {
    convertCoords(event);
    //socket.send("c " + event.offsetX + " " + event.offsetY);
  });
 }
 
 var buttonMap = {
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

function InitKeyboardTracking()
{
  $(window).keydown(function(event){
    console.log(event.keyCode);
    buttons =  buttons | buttonMap[event.keyCode];
    socket.send("k " + buttons);
  }); 
  $(window).keyup(function(event){
    buttons = buttons & ~buttonMap[event.keyCode];
    socket.send("k " + buttons);
  }); 
}
 