var socket;

$(document).ready(function() {
  InitMessaging();
  InitPlayer();
  InitMouseTracking();
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
 
 function InitMouseTracking()
 {
  $("#videoCanvas").mousemove(function(event) {
    socket.send("m " + event.pageX + " " + event.pageY);
  });
  $("#videoCanvas").mousedown(function(event) {
    socket.send("c " + event.pageX + " " + event.pageY);
  });
 }