var Storage = function (app) {
  'use strict';

  return {
    get: function(key, data, func) {
      if (window.chrome) {
        chrome.storage.local.get(data, func);
      } else {
        var item = localStorage.getItem(key);
        if (item !== undefined) {
          data = JSON.parse(item);
        }
        func(data);
      }
    },

    set: function(key, data) {
      if (window.chrome) {
        chrome.storage.local.set(data);
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
  };
};

module.exports = Storage;
