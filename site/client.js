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
 
  var wiiSideMap = {
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
 
 var gamecubeMap = {
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

 var games = {
  "R2DEEB":"Dokapon Kingdom",
  "RSBE01":"Super Smash Bros Brawl",
  "GALE01":"Super Smash Bros Melee"
};

var socket;
var buttons = 0;
var player = 1;
var buttonMap = wiiSideMap;

$(document).ready(function() {
  InitMessaging();
  InitPlayer();
  InitMouseTracking();
  InitKeyboardTracking();
  InitPageControls();
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
  socket.on('game', function(game) {
    $('#gameSelect').val(game);
  });
}
 
 function InitPlayer()
 {
  $f("live", "http://releases.flowplayer.org/swf/flowplayer-3.2.16.swf", {
    onBeforeFullscreen: function() {
      return false;
    },
    clip: {
      url: 'test',
      live: true,
      // configure clip to use influxis as our provider, it uses our rtmp plugin
      provider: 'influxis',
      bufferLength : 0, 
      autoPlay: true,
      onBeforePause : function(){
        return false;
      }
    },
    // streaming plugins are configured under the plugins node
    plugins: {
      controls: null,
      // here is our rtpm plugin configuration
      influxis: {
        url: "flowplayer.rtmp-3.2.12.swf",
        // netConnectionUrl defines where the streams are found
        netConnectionUrl: 'rtmp://' + window.location.hostname + ':1935/live'
      }
    }
  });

  $f("audio", "http://releases.flowplayer.org/swf/flowplayer-3.2.16.swf", {
    onBeforeFullscreen: function() {
        return false;
    },
    clip: {
      url: 'audio',
      live: true,
      // configure clip to use influxis as our provider, it uses our rtmp plugin
      provider: 'influxis',
      bufferLength : 0, 
      autoPlay: true,
      onBeforePause : function(){
        return false;
      }
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
    var canvasOffset = $('#live').offset();
    event.offsetX = event.pageX - canvasOffset.left;
    event.offsetY = event.pageY - canvasOffset.top;
  }
  event.offsetX = event.offsetX / 640.0 * 2 - 1;
  event.offsetY = event.offsetY / 480.0 * 2 - 1;
}

function InitMouseTracking()
{
  // TODO: Mouse tracking for all
  $("#live").mousemove(function(event) {
    if (player != 1)
      return;
    convertCoords(event);
    socket.send(player + " m " + event.offsetX + " " + event.offsetY);
  });
  $("#live").mousedown(function(event) {
    socket.send(player + " b 1");
  });
  $("#live").mouseup(function(event) {
    socket.send(player + " b 0");
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

function InitPageControls(){
  var url = document.URL;
  if (~url.indexOf("#")) var urlId = url.substr(url.lastIndexOf("#")+1);
  $("." + urlId).removeClass("hidden");
  if(urlId == "wiiSide"){
    $("[data-controllerid^='wii']").addClass("hidden");
    $("[data-controllerid^='wiiSide']").removeClass("hidden");
    $("[data-controllerid^='wiiSide']").addClass("selected");
    $(".columns .wii").removeClass("hidden");
    $("[href^='#wii']").addClass("selected");
  }
  $("[href^='#" + urlId + "']").addClass("selected");

  $("#playernumber").click(function(){
    var previousNumber = parseInt(this.innerHTML);
    if(previousNumber >= 4){
      this.innerHTML = 1;
      player = 1;
    } else {
      previousNumber++;
      this.innerHTML = previousNumber;
      player = previousNumber;
    }
  });

  $(".controllers a").click(function(){
    var controller = $(this).attr("data-controllerid");
    var previouscontroller = $($(".selected")[0]).attr("data-controllerid");
    for(i = 0;i < $(".controllers a").length;i++){
      $($(".controllers a")[i]).removeClass("selected");
    }
    if(previouscontroller == "wii" || "wiiSide"){
      if(controller == "wii"){
        $("[data-controllerid^='wii']").addClass("hidden");
        $("[data-controllerid^='wiiSide']").removeClass("hidden");
        $("[data-controllerid^='wiiSide']").addClass("selected");
      } 
      if(controller == "wiiSide"){
        $("[data-controllerid^='wii']").removeClass("hidden");
        $("[data-controllerid^='wiiSide']").addClass("hidden");
        $("[data-controllerid^='wii']").addClass("selected");
      }
    }
    $(this).addClass("selected");
    buttonMap = window[controller + "Map"];
  });

  $(".media a").click(function(){
    var medium = $(this).attr("data-mediumid");
    for(i = 0;i < $(".media a").length;i++){
      $($(".media a")[i]).removeClass("selected");
    }
    $(this).addClass("selected");
    for(i = 0;i < $(".games").length;i++){
      $($(".games")[i]).addClass("hidden");
    }
    $("." + medium).removeClass("hidden");
  });

  $(".games a").click(function(){
    var gameid = $(this).attr("data-gameid");
    $("#gamename").text(games[gameid]);
    socket.send(player + " g " + gameid);
  });
}
