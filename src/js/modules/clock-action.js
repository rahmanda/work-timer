var Moment = require('moment');

var ClockAction = function (context) {
  'use strict';

  return {
    behaviors: ['input-zeroed'],

    messages: ['clock-action-reset',
               'clock-action-chart',
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
      var menu, menuBtn, chart;
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
        this.onmessage('clock-action-reset');
        break;
      case 'clock-action-save':
        context.broadcast('clock-timer-save');
        break;
      case 'clock-action-menu':
        menu = document.getElementsByClassName('js-menu')[0];
        menu.classList.toggle('is-open');
        break;
      case 'clock-action-menu-close':
        menu = document.getElementsByClassName('js-menu')[0];
        menu.classList.toggle('is-open');
        menuBtn = document.getElementsByClassName('js-menu-btn')[0];
        break;
      case 'clock-action-chart':
        menu = document.getElementsByClassName('js-menu')[0];
        menu.classList.toggle('is-open');
        chart = document.getElementsByClassName('js-chart')[0];
        chart.classList.toggle('is-open');
        context.broadcast('clock-timer-generate-chart');
        break;
      case 'clock-action-chart-close':
        chart = document.getElementsByClassName('js-chart')[0];
        chart.classList.toggle('is-open');
        break;
      case 'clock-action-setting':
        context.broadcast('clock-setting');
      }
    },

    onkeyup: function(ev, el, elType) {
      switch (elType) {
      case 'input-zeroed':
        context.broadcast('clock-timer-set-duration', this.getDuration(this.getInputValue()));
        break;
      }
    },

    getInputValue: function() {
      var hour = document.getElementsByClassName('js-timer-hour')[0];
      var minute = document.getElementsByClassName('js-timer-minute')[0];
      var second = document.getElementsByClassName('js-timer-second')[0];

      return {
        hour: hour.value === '' ? '0' : hour.value,
        minute: minute.value === '' ? '0' : minute.value,
        second: second.value === '' ? '0' : second.value
      };
    },

    getDuration: function(time) {
      var hour = parseInt(time.hour, 10);
      var minute = parseInt(time.minute, 10);
      var second = parseInt(time.second, 10);

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
