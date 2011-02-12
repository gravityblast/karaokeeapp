Function.prototype.bind = function(object, args) {
  var _args = args || [];
  var _fun = this;
  return function() {
    return _fun.apply(object, arguments);
  };
};

var App = {
  init: function() {
  
  },
  
  d: function(message) {
    try {
      console.debug(message);
    } catch(error) {}
  }
};