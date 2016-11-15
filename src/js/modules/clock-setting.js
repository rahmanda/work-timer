var ClockSetting = function (context) {
  'use strict';

  var KEY = 'wrktmrsttng';

  return {
    setting: null,

    storage: null,

    messages: ['clock-setting', 'clock-setting-close'],

    init: function() {
      this.storage = context.getService('storage');
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
        break;
      }
    },

    onchange: function(ev, el, elType) {
      switch (elType) {
      case 'clock-setting-unlimited':
        this.setting.general.unlimited = el.value;
        break;
      case 'clock-setting-weekly-work-duration':
        this.setting.general.weeklyWorkDuration = parseInt(el.value, 10);
      }
    },

    get: function() {
      var defaultSetting = {};
      defaultSetting[KEY] = {
        general: {
          unlimited: true,
          weeklyWorkDuration: 0
        }
      };
      this.storage.get(KEY, defaultSetting, this.getSetting.bind(this));
    },

    getSetting: function(item) {
      this.setting = item[KEY];
      this.render();
    },

    save: function() {
      var setup = {};
      setup[KEY] = this.setting;
      this.storage.set(KEY, setup);
    },

    render: function() {
      document.getElementsByClassName('js-setting-unlimited')[0].value = this.setting.general.unlimited;
      document.getElementsByClassName('js-setting-weekly')[0].value = this.setting.general.weeklyWorkDuration;
    }
  };
};

module.exports = ClockSetting;
