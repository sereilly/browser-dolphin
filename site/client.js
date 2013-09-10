$(document).ready(function() {
  socket = io.connect();
	var messageField = $('#messageField');
	var sendBtn = $('#sendBtn');
  var socket;
	sendBtn.click(function() {
		if (messageField.val().length > 0) {
			var message = messageField.val();
			socket.send(message);
			messageField.val('');
		}
	});
 });