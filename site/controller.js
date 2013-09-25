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

$(document).ready(function(){
  $(".games a").click(function(){
    var gameid = $(this).attr("data-gameid");
  })
  $("#playernumber").click(function(){
    var previousNumber = parseInt(this.innerHTML);
    if(previousNumber >= 4){
      this.innerHTML = 1;
    } else {
      this.innerHTML = previousNumber += 1;
    }
  })
  function InitDropdowns()
  {
    $('#playerSelect').on("change", function() {
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
    });
  }
});