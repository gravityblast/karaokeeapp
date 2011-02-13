App.Tap = {    
  reset: function() {
    this.currentLine = 0;
  },
  
  init: function() {    
    this.reset();
    $(document).bind("keydown", this.keyDownHandler.bind(this));
  },  
  
  keyDownHandler: function(event) {
    if (event.keyCode == 13) {
      var line = $("#lyrics .line-" + (++this.currentLine));
      line.addClass("tapped");
      line.attr("data-lrc-time", App.VideoSearch.getCurrentTime());
    }
  },
  
  playerLoadHandler: function() {
    this.currentLine = 0;
    $("#lyrics .p").attr("data-lrc-time", "");
  },
  
  dumpLRC: function() {
    var lrc = [];
    $("#lyrics p").each(function(index, element) {
      lrc.push({
        time: parseFloat($(element).attr("data-lrc-time")),
        text: $(element).text()
      });
    });
    return lrc;
  },
  
  playerStateHandler: function(state) {
    switch(state) {
      case 0: // end      
        break;
      case 1: // play
        break;
      case 2: // pause
        break;
      case undefined:
        App.d("LOADED");
        break;
    }
  }
};