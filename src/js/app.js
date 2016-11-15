var Box = require('t3js');

Box.Application.addBehavior('input-zeroed', require('./behaviors/input-zeroed'));

Box.Application.addService('storage', require('./services/storage'));

Box.Application.addModule('container', require('./modules/container'));
Box.Application.addModule('clock-timer', require('./modules/clock-timer'));
Box.Application.addModule('clock-action', require('./modules/clock-action'));
Box.Application.addModule('clock-chart', require('./modules/clock-chart'));
Box.Application.addModule('clock-setting', require('./modules/clock-setting'));

Box.Application.init();

if (window.chrome) {
  chrome.app.window.current().maximize();
}
