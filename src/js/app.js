var Box = require('t3js');

Box.Application.addModule('clock-timer', require('./modules/clock-timer'));
Box.Application.addModule('clock-action', require('./modules/clock-action'));

Box.Application.init();

if (window.chrome) {
  chrome.app.window.current().maximize();
}
