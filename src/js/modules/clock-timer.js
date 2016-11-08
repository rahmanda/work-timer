var Box  = require('t3js');
var Moment = require('moment');

var ClockTimer = function (context) {

  'use strict';

  var el, currentTime, endTime, timer;

  var INTERVAL = 1000; // ms

  var KEY = 'wrktmrlst';

  function secondsToTime(secs, json){
    json = json === undefined ? false : json;
    if (secs < 0) { secs = -1 * secs; }
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if (json) {
      return {hour: pad(hours, 2), minute: pad(minutes, 2), second: pad(seconds, 2)};
    } else {
      return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
    }
  }

  function pad(num, size){ return ('000000000' + num).substr(-size); }

  return {

    isPaused: false,

    duration: 0,

    init: function() {
      el = context.getElement();
      currentTime = Moment();
      endTime = Moment();
    },

    destroy: function() {
      el = null;
      currentTime = null;
      endTime = null;
      timer = null;
    },

    messages: ['clock-timer-pause',
               'clock-timer-start',
               'clock-timer-resume',
               'clock-timer-reset',
               'clock-timer-save',
               'clock-timer-clear',
               'clock-timer-set-duration'],

    // @param {string} name
    // @param {html string} data
    onmessage: function(name, data) {
      switch(name){
      case 'clock-timer-pause':
        this.pause();
        break;
      case 'clock-timer-start':
        this.start();
        break;
      case 'clock-timer-resume':
        this.resume();
        break;
      case 'clock-timer-reset':
        this.reset();
        break;
      case 'clock-timer-save':
        this.save();
        break;
      case 'clock-timer-set-duration':
        this.setDuration(data);
        break;
      }
    },

    // Set end time
    // @param {float} duration in second
    // @return void
    setDuration: function(duration) {
      this.duration = Math.floor(duration);
      this.render();
    },

    // Start clock
    // @param void
    // @return void
    start: function() {
      var _this = this;
      timer = window.setInterval(function() {
        if(!_this.isPaused) {
          _this.duration--;
          _this.render();
          context.broadcast('clock-action-timer-update', secondsToTime(_this.duration, true));
        }
      }, INTERVAL);
    },

    // Pause clock
    // @param void
    // @return void
    pause: function() {
      this.isPaused = true;
    },

    // Pause clock
    // @param void
    // @return void
    resume: function() {
      this.isPaused = false;
    },

    save: function() {
      var list = localStorage.getItem(KEY);
      var data = {duration: this.duration, createdAt: Moment()};
      if (list) {
        list = JSON.parse(list);
        if (list.length > 30) {
          list.pop();
        }
        list.unshift(data);
      } else {
        list = [];
        list.push(data);
      }
      localStorage.setItem(KEY, JSON.stringify(list));
    },

    // Reset clock
    // @param void
    // @return void
    reset: function() {
      this.isPaused = false;
      this.duration = 0;
      endTime = Moment();
      window.clearInterval(timer);
      this.render();
      context.broadcast('clock-action-reset');
    },

    render: function() {
      var target = document.getElementsByClassName('js-time')[0];
      if (this.duration < 0) {
        target.classList.add('u-text--success');
      } else {
        target.classList.remove('u-text--success');
      }
      target.innerHTML = secondsToTime(this.duration);
    }

  };

};

module.exports = ClockTimer;
