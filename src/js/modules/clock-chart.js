var Chart = require('chart.js');

var ClockChart = function (context) {
  var el, canvas;

  return {
    chart: null,

    messages: ['clock-chart-open',
               'clock-chart-generate',
               'clock-chart-close'],

    init: function() {
      el = context.getElement();
      canvas = el.getContext('2d');
      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7'],
          datasets: [
            {
              label: 'your work duration',
              data: [65, 59, 80, 81, 56, 55, 40],
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10
            }
          ]
        }
      });
    },

    destroy: function() {
      el = null;
      this.chart = null;
    },

    onmessage: function(name, data) {
      switch (name) {
      case 'clock-chart-open':
        this.open();
        break;
      case 'clock-chart-generate':
        this.generate(data);
        break;
      case 'clock-chart-close':
        this.close();
        break;
      }
    },

    open: function() {
      el.classList.add('is-open');
    },

    generate: function(data) {
      this.chart.data.labels = data.labels;
      this.chart.data.datasets[0].data = data.datasets;
      this.chart.update();
    },

    close: function() {
      el.classList.remove('is-open');
    }
  };
};

module.exports = ClockChart;
