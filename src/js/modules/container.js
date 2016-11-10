var Container = function (context) {
  'use strict';

  var el;

  return {
    init: function() {
      el = context.getElement();

      this.setWidth();
      this.resize();
    },

    setWidth: function() {
      el.style.width = (window.innerWidth - 40) + 'px';
    },

    resize: function() {
      var _this = this;
      window.addEventListener('resize', function() {
        _this.setWidth();
      });
    }
  };
};

module.exports = Container;
