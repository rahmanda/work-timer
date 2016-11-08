var Moment = require('moment');

var ClockAction = function (context) {
  'use strict';

  var hour, minute, second;

  return {
    init: function() {
      hour = 0;
      minute = 0;
      second = 0;
    },

    destroy: function() {
      hour = null;
      minute = null;
      second = null;
    },

    messages: ['clock-action-reset',
               'clock-action-timer-update'],

    onmessage: function(name, data) {
      switch (name) {
      case 'clock-action-reset':
        document.getElementsByClassName('js-timer-hour')[0].value = '00';
        document.getElementsByClassName('js-timer-minute')[0].value = '00';
        document.getElementsByClassName('js-timer-second')[0].value = '00';
        break;
      case 'clock-action-timer-update':
        document.getElementsByClassName('js-timer-hour')[0].value = data.hour;
        document.getElementsByClassName('js-timer-minute')[0].value = data.minute;
        document.getElementsByClassName('js-timer-second')[0].value = data.second;
        break;
      }
    },

    onclick: function(ev, el, evType) {
      switch (evType) {
      case 'clock-action-start':
        ev.preventDefault();
        context.broadcast('clock-timer-start');
        this.disable('start');
        this.disable('pause', false);
        this.disable('resume');
        this.disable('reset');
        this.disable('save');
        this.disableInput();
        break;
      case 'clock-action-pause':
        ev.preventDefault();
        context.broadcast('clock-timer-pause');
        this.disable('start');
        this.disable('pause');
        this.disable('resume', false);
        this.disable('reset', false);
        this.disable('save', false);
        this.disableInput(false);
        break;
      case 'clock-action-resume':
        ev.preventDefault();
        context.broadcast('clock-timer-resume');
        this.disable('start');
        this.disable('pause', false);
        this.disable('resume');
        this.disable('reset');
        this.disable('save');
        this.disableInput();
        break;
      case 'clock-action-reset':
        ev.preventDefault();
        context.broadcast('clock-timer-reset');
        this.disable('start', false);
        this.disable('pause');
        this.disable('resume');
        this.disable('reset');
        this.disable('save');
        this.disableInput(false);
        break;
      case 'clock-action-save':
        context.broadcast('clock-timer-save');
        break;
      }
    },

    onkeyup: function(ev, el, evType) {
      switch (evType) {
      case 'clock-action-set-duration-hour':
        context.broadcast('clock-timer-set-duration', this.getDuration({hour: el.value === '' ? '0' : el.value}));
        break;
      case 'clock-action-set-duration-minute':
        context.broadcast('clock-timer-set-duration', this.getDuration({minute: el.value === '' ? '0' : el.value}));
        break;
      case 'clock-action-set-duration-second':
        context.broadcast('clock-timer-set-duration', this.getDuration({second: el.value === '' ? '0' : el.value}));
        break;
      }
    },

    getDuration: function(time) {
      if (time.hasOwnProperty('hour')) {
        hour = parseInt(time.hour, 10);
      } else if (time.hasOwnProperty('minute')) {
        minute = parseInt(time.minute, 10);
      } else if (time.hasOwnProperty('second')) {
        second = parseInt(time.second, 10);
      }

      return Moment.duration({hour: hour, minute: minute, second: second}).asSeconds();
    },

    disable: function(state, isDisable) {
      isDisable = isDisable === undefined ? true : isDisable;
      var target = document.getElementsByClassName('js-clock-action-' + state)[0];
      if (isDisable) {
        target.setAttribute('disabled', 'disabled');
      } else {
        target.removeAttribute('disabled');
      }
    },

    disableInput: function(isDisable) {
      isDisable = isDisable === undefined ? true : isDisable;
      if (isDisable) {
        document.getElementsByClassName('js-timer-input')[0].classList.add('is-hidden');
        document.getElementsByClassName('js-timer')[0].classList.remove('is-hidden');
      } else {
        document.getElementsByClassName('js-timer-input')[0].classList.remove('is-hidden');
        document.getElementsByClassName('js-timer')[0].classList.add('is-hidden');
      }
    }

   };
};

module.exports = ClockAction;
