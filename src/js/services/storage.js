var Storage = function (app) {
  'use strict';

  var isChromeStorageAvailable = function() {
    return window.chrome && chrome.app && chrome.app.runtime;
  };

  return {
    get: function(key, data, func) {
      if (isChromeStorageAvailable()) {
        chrome.storage.local.get(data, func);
      } else {
        var item = localStorage.getItem(key);
        if (item !== undefined && item !== null) {
          data = JSON.parse(item);
        }

        if (func !== undefined && func !== null) {
          func(data);
        }
      }
    },

    set: function(key, data, func) {
      if (isChromeStorageAvailable()) {
        chrome.storage.local.set(data, func);
      } else {
        localStorage.setItem(key, JSON.stringify(data));

        if (func !== undefined && func !== null) {
          func(data);
        }
      }
    },

    remove: function(key, data, func) {
      if (isChromeStorageAvailable()) {
        chrome.storage.local.remove(key, func);
      } else {
        localStorage.removeItem(key);

        if (func !== undefined && func !== null) {
          func(data);
        }
      }
    },

    clear: function(data, func) {
      if (isChromeStorageAvailable()) {
        chrome.storage.local.clear(func);
      } else {
        localStorage.clear();
        if (func !== undefined && func !== null) {
          func(data);
        }
      }
    }
  };
};

module.exports = Storage;
