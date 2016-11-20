var Box  = require('t3js');
var Moment = require('moment');

var ClockTimer = function (context) {

  'use strict';

  var el, timer;

  var INTERVAL = 1000; // ms

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

    isPaused: false, remaining: 0, duration: 0, storage: null,

    storageKey: null, storageDuration: 0, setting: null,

    init: function() {
      el = context.getElement();
      this.storageKey = context.getService('storage-key');
      this.storage = context.getService('clock-storage');
      this.storage.init();
      this.getSettingFromStorage();
      this.getDurationFromStorage();
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
               'clock-timer-set-remaining',
               'clock-timer-generate-chart',
               'clock-setting-update'],

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
        this.storage.getTime(this.save.bind(this));
        this.getSettingFromStorage();
        context.broadcast('flash-message', 'Work time is saved');
        break;
      case 'clock-timer-set-duration':
        this.setDuration(data);
        break;
      case 'clock-timer-set-remaining':
        this.setRemaining(data);
        break;
      case 'clock-timer-generate-chart':
        this.storage.getTime(this.generateChart.bind(this));
        break;
      case 'clock-setting-update':
        this.getSettingFromStorage();
        break;
      }
    },

    getSettingFromStorage: function() {
      this.storage.getSetting(this.setSetting.bind(this));
    },

    getDurationFromStorage: function() {
      this.storage.getTime(this.sumDurationFromStorage.bind(this));
    },

    sumDurationFromStorage: function(item) {
      var dataset = item[this.storageKey.timer];
      if (dataset.length > 0) {
        this.storageDuration = item[this.storageKey.timer].reduce(function(previous, b) {
          return previous + b.duration;
        }, 0);
      }
      this.renderDuration();
    },

    setSetting: function(item) {
      this.setting = item[this.storageKey.setting];
      this.renderDuration();
    },

    // Set end time
    // @param {float} duration in second
    // @return void
    setDuration: function(duration) {
      this.duration = Math.floor(duration);
      this.renderDuration();
    },

    setRemaining: function(remaining) {
      this.remaining = Math.floor(remaining);
      this.render();
    },

    // Start clock
    // @param void
    // @return void
    start: function() {
      var _this = this;
      timer = window.setInterval(function() {
        if(!_this.isPaused) {
          _this.remaining--;
          _this.duration++;
          _this.render();
          _this.renderDuration();
          context.broadcast('clock-action-timer-update', secondsToTime(_this.remaining, true));
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
      var data = {remaining: this.remaining, duration: this.duration, createdAt: Moment().toISOString()};
      if (item === null) {
        item = [data];
      } else {
        var dataset = item[this.storageKey.timer];
        if (dataset.length > 30) {
          dataset.pop();
        }
        dataset.unshift(data);
      }
      this.storage.saveTime(dataset);
    },

    // Reset clock
    // @param void
    // @return void
    reset: function() {
      this.isPaused = false;
      this.duration = 0;
      this.remaining = 0;
      window.clearInterval(timer);
      this.render();
      this.renderDuration();
    },

    render: function() {
      var target = document.getElementsByClassName('js-time')[0];
      if (this.remaining < 0) {
        target.classList.add('u-text--success');
      } else {
        target.classList.remove('u-text--success');
      }
      target.innerHTML = secondsToTime(this.remaining);
    },

    renderDuration: function() {
      if (this.setting.general.weeklyWorkHours > 0) {
        var target = document.getElementsByClassName('js-time-duration')[0];
        var remaining = this.setting.general.weeklyWorkHours * 3600 - this.duration - this.storageDuration;
        if (remaining < 0) {
          target.classList.add('u-text--success');
        } else {
          target.classList.remove('u-text--success');
        }
        target.innerHTML = secondsToTime(remaining);
      }
    },

    generateChart: function(data) {
      data = data[this.storageKey.timer];
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
