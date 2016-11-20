var ClockSetting = function (context) {
  'use strict';

  return {
    setting: null, storage: null,

    messages: ['clock-setting', 'clock-setting-close'],

    init: function() {
      this.storage = context.getService('clock-storage');
      this.storageKey = context.getService('storage-key');
      this.storage.init();
      this.get();
    },

    onmessage: function(name, data) {
      switch (name) {
      case 'clock-setting':
        this.onclick(null, null, 'clock-setting');
        break;
      case 'clock-setting-close':
        this.onclick(null, null, 'clock-setting-close');
        break;
      }
    },

    onclick: function (ev, el, elType) {
      var menu, setting;
      switch (elType) {
      case 'clock-setting':
        menu = document.getElementsByClassName('js-menu')[0];
        menu.classList.toggle('is-open');
        setting = document.getElementsByClassName('js-setting')[0];
        setting.classList.toggle('is-open');
        break;
      case 'clock-setting-close':
        setting = document.getElementsByClassName('js-setting')[0];
        setting.classList.toggle('is-open');
        break;
      case 'clock-setting-save':
        this.save();
        context.broadcast('flash-message', 'Setting is saved');
        break;
      case 'clock-setting-clear-storage':
        this.clearStorage();
        break;
      }
    },

    onchange: function(ev, el, elType) {
      switch (elType) {
      case 'clock-setting-unlimited':
        this.setting.general.unlimited = parseInt(el.value, 10);
        break;
      case 'clock-setting-weekly-work-duration':
        this.setting.general.weeklyWorkHours = parseInt(el.value, 10);
      }
    },

    get: function() {
      this.storage.getSetting(this.getSetting.bind(this));
    },

    getSetting: function(item) {
      this.setting = item[this.storageKey.setting];
      this.render();
    },

    save: function() {
      this.storage.saveSetting(this.setting, this.broadcastUpdate.bind(this));
    },

    broadcastUpdate: function() {
      context.broadcast('clock-setting-update');
    },

    clearStorage: function() {
      this.storage.removeSetting();
      context.broadcast('flash-message', 'Storage is clear');
      this.broadcastUpdate();
    },

    render: function() {
      document.getElementsByClassName('js-setting-unlimited')[0].value = this.setting.general.unlimited;
      document.getElementsByClassName('js-setting-weekly')[0].value = this.setting.general.weeklyWorkHours;
    }
  };
};

module.exports = ClockSetting;
