var Flash = function (context) {
  'use strict';

  var el;

  return {
    messages: ['flash-message'],

    onmessage: function(name, data) {

    },

    init: function() {
      el = context.getElement();
    },

    show: function() {

    }
  };
};

module.exports = Flash;
