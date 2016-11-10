var Box  = require('t3js');
var Moment = require('moment');

var ClockTimer = function (context) {

  'use strict';

  var el, timer;

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

  function getData(data, func) {
    if (window.chrome) {
      chrome.storage.local.get(data, func);
    } else {
      data = JSON.parse(localStorage.getItem(KEY));
      func(data);
    }
  }

  function setData(data) {
    if (window.chrome) {
      chrome.storage.local.set(data);
    } else {
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  }

  return {

    isPaused: false,

    duration: 0,

    init: function() {
      el = context.getElement();
    },

    destroy: function() {
      el = null;
      timer = null;
    },

    messages: ['clock-timer-pause',
               'clock-timer-start',
               'clock-timer-resume',
               'clock-timer-reset',
               'clock-timer-save',
               'clock-timer-clear',
               'clock-timer-set-duration',
              'clock-timer-generate-chart'],

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
        var dataset = {};
        dataset[KEY] = [];
        getData(dataset, this.save.bind(this));
        break;
      case 'clock-timer-set-duration':
        this.setDuration(data);
        break;
      case 'clock-timer-generate-chart':
        var key = {};
        key[KEY] = [];
        getData(key, this.generateChart.bind(this));
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

    save: function(item) {
      var data = {duration: this.duration, createdAt: Moment().toISOString()};
      if (item === null) {
        item = {};
        item[KEY] = [data];
      } else {
        if (item[KEY].length > 30) {
          item[KEY].pop();
        }
        item[KEY].unshift(data);
      }
      setData(item);
    },

    // Reset clock
    // @param void
    // @return void
    reset: function() {
      this.isPaused = false;
      this.duration = 0;
      window.clearInterval(timer);
      this.render();
    },

    render: function() {
      var target = document.getElementsByClassName('js-time')[0];
      if (this.duration < 0) {
        target.classList.add('u-text--success');
      } else {
        target.classList.remove('u-text--success');
      }
      target.innerHTML = secondsToTime(this.duration);
    },

    generateChart: function(data) {
      data = data[KEY];
      var labels = [];
      var datasets = [];
      if (data) {
        data.forEach(function(item) {
          labels.push(Moment(item.createdAt).format('YYYY-MM-DD'));
          datasets.push(Moment.duration(secondsToTime(item.duration, true)).asHours());
        });
      }
      context.broadcast('clock-chart-generate', {labels: labels, datasets: datasets});
    }

  };

};

module.exports = ClockTimer;
