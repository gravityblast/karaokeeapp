App.VideoSearch = {
  listeners: {}
};

App.VideoSearch.init = function() {
  var params = { allowScriptAccess: "always" };
  var atts = { id: "ytplayer" };
  swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer", "ytplayer-container", "250", "209", "8", null, null, params, atts);
};

App.VideoSearch.addEventListener = function(eventName, callback) {
  if (!App.VideoSearch.listeners[eventName]) {
    App.VideoSearch.listeners[eventName] = [];
  }
  App.VideoSearch.listeners[eventName].push(callback);
};

App.VideoSearch.onYouTubePlayerReady = function(playerId) {  
  App.d("youtube player ready");
  App.VideoSearch.ytPlayerId = playerId;  
  var ytplayer = document.getElementById(playerId);  
  ytplayer.addEventListener("onStateChange", "App.VideoSearch.youtubePlayerStateChangeHandler");
  App.d("player state " + (this.playing ? "playing" : "paused"));
  if (this.playing) {
    ytplayer.playVideo();
  }
  App.VideoSearch.fireEvent("playerReady");
};

App.VideoSearch.play = function() {
  if (App.VideoSearch.ytPlayerId) {
    var player = document.getElementById(App.VideoSearch.ytPlayerId);
    player.playVideo();
  }
};

App.VideoSearch.getCurrentTime = function() {
  if (App.VideoSearch.ytPlayerId) {
    var player = document.getElementById(App.VideoSearch.ytPlayerId);    
    return player.getCurrentTime();
  } else {
    return 0;
  }
};

App.VideoSearch.seekToStart = function() {
  if (App.VideoSearch.ytPlayerId) {
    var player = document.getElementById(App.VideoSearch.ytPlayerId);
    player.seekTo(0);
  }  
};


App.VideoSearch.youtubePlayerStateChangeHandler = function(state) {  
  switch(state) {
    case 0:
      App.VideoSearch.fireEvent("end");
      break;
    case 1:
      this.playing = true;
      App.d("player playing");
      break;
    case 2:
      this.playing = false;
      App.d("player paused");
      break;
    default:
      App.d("player state: " + state);
      break;    
  }  
};

App.VideoSearch.fireEvent = function(eventName, params) {
  params = params || [];
  if (App.VideoSearch.listeners[eventName] instanceof Array) {
    for (var i = 0; i < App.VideoSearch.listeners[eventName].length; i++) {
      App.VideoSearch.listeners[eventName][i](params);
    }
  } else {
    App.d(typeof App.VideoSearch.listeners[eventName]);
  }
};

var onYouTubePlayerReady = App.VideoSearch.onYouTubePlayerReady.bind(App.VideoSearch);

App.VideoSearch.search = function(query) {
  this.query = query;
  this.start();
};

App.VideoSearch.start = function() {
  App.d("search video " + this.query);
  var url = 'http://gdata.youtube.com/feeds/api/videos?q=' + encodeURIComponent(this.query) + '&format=5&max-results=5&v=2&alt=jsonc';
  try {
    $.ajax({
      cache: false,
      type: "GET",
      url: url,
      dataType: "jsonp",
      success: this.responseHandler.bind(this)
    });
  } catch(error) {}
};

App.VideoSearch.responseHandler = function(response, textStatus, XMLHttpRequest) {
  if (response.data.items && response.data.items.length > 0) {        
    var html = "";
    for (var i = 0; i < response.data.items.length; i++) {
      var video = response.data.items[i];
      html += '<a href="#" class="video-' + video.id + '" onclick="App.VideoSearch.showVideoAndSelectPage(\'' + video.id + '\');return false;">' + (i + 1) + '</a>';
    }
    $("#video-container .pagination .pages").html(html);
    this.showVideoAndSelectPage(response.data.items[0].id);
  }
};

App.VideoSearch.showVideoAndSelectPage = function(video_id) {
  $("#video-container .pagination .pages a").removeClass("current");
  $("#video-container .pagination .pages a.video-" + video_id).addClass("current");
  App.VideoSearch.showVideo(video_id);
};

App.VideoSearch.showVideo = function(video_id) {
  var container = document.getElementById("ytplayer-container");
  App.VideoSearch.seekToStart();
  var player = document.getElementById(App.VideoSearch.ytPlayerId);
  if (player) {
    player.cueVideoById(video_id);
  }
  App.VideoSearch.fireEvent("videoLoaded", video_id);
};

App.VideoSearch.stopVideo = function(video_id) {
  App.d("stopping video");
  if (this.ytPlayerId) {
    var player = document.getElementById(this.ytPlayerId);
    if (player) {
      try {
        player.stopVideo();
        App.d("Video stopped");
      } catch(e) {}
    } else {
      App.d("no video player");
    }
  } else {
    App.d("no video id");
  }
};