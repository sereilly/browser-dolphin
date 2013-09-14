$(document).ready(function() {
  InitMessaging();
  InitPlayer();
 });
 
 function InitMessaging()
 {
  var socket = io.connect();
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
  var client = new WebSocket( 'ws://71.197.145.11:8084/' );
  var player = new jsmpeg(client, {canvas: canvas, autoplay: true, loop: true});
 }