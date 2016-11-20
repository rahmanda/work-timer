var ClockStorage = function (app) {
  'use strict';

  return {
    storage: null,

    storageKey: null,

    init: function() {
      this.storage = app.getService('storage');
      this.storageKey = app.getService('storage-key');
    },

    saveSetting: function(data, callback) {
      var setup = {};
      setup[this.storageKey.setting] = data;
      this.storage.set(this.storageKey.setting, setup, callback);
    },

    getSetting: function(callback) {
      var defaultSetting = {};
      defaultSetting[this.storageKey.setting] = {
        general: {
          unlimited: 1,
          weeklyWorkHours: 0
        }
      };
      this.storage.get(this.storageKey.setting, defaultSetting, callback);
    },

    removeSetting: function() {
      this.storage.remove(this.storageKey.timer);
    },

    saveTime: function(data, callback) {
      var setup = {};
      setup[this.storageKey.timer] = data;
      this.storage.set(this.storageKey.timer, setup, callback);
    },

    getTime: function(callback) {
      var dataset = {};
      dataset[this.storageKey.timer] = [];
      this.storage.get(this.storageKey.timer, dataset, callback);
    },

    addToSaveCounter: function(data, callback) {
      var setup = {};
      setup[this.storageKey.saveCounter] = data;
      this.storage.set(this.storageKey.saveCounter, setup, callback);
    },

    getSaveCounter: function(callback) {
      var defaultSetting = {};
      defaultSetting[this.storagekey.saveCounter] = 0;
      this.storage.get(this.storageKey.saveCounter, defaultSetting, callback);
    }
  };
};

module.exports = ClockStorage;
