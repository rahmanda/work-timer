var InputZeroed = function(context) {

  'use strict';

  function pad(num, size){ return ('000000000' + num).substr(-size); }

  function debounce(func, wait, immediate) {
	  var timeout;
	  return function() {
		  var context = this, args = arguments;
		  var later = function() {
			  timeout = null;
			  if (!immediate) func.apply(context, args);
		  };
		  var callNow = immediate && !timeout;
		  clearTimeout(timeout);
		  timeout = setTimeout(later, wait);
		  if (callNow) func.apply(context, args);
	  };
  }

  return {

    onkeyup: function(ev, el, elType) {

      ev.preventDefault();

      var _this = this;

      debounce(function() {
        console.log('bla');
        _this.addZeroPadded(el);
      }, 500);

    },

    addZeroPadded: function(el) {
      console.log(el);
      el.value = pad(el.value, 2);
    }

  };

};

module.exports = InputZeroed;
