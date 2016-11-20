var Flash = function (context) {
  'use strict';

  var el, timeoutID;
  var DEFAULT_TIMEOUT = 2000;

  return {
    messages: ['flash-message'],

    onmessage: function(name, data) {
      if (name === 'flash-message') {
        this.show(data);
      }
    },

    onclick: function(ev, el, evType) {
      if (evType === 'flash-close') {
        this.hide();
      }
    },

    init: function() {
      el = context.getElement();
    },

    show: function(message) {
      var _this = this;
      el.classList.add('is-show');
      el.getElementsByClassName('js-notif-content')[0].innerHTML = message;
      timeoutID = setTimeout(function() {
        _this.hide();
      }, DEFAULT_TIMEOUT);
    },

    hide: function() {
      el.classList.remove('is-show');
      clearTimeout(timeoutID);
    }
  };
};

module.exports = Flash;
