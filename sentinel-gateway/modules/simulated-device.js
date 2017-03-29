'use strict'

let utf8 = require('./util').utf8

module.exports = {
  broker: null,
  configuration: null,
  intervalID: -1,

  create: function (broker, configuration) {
    this.broker = broker;
    this.configuration = configuration;
    return true;
  },

  start: function () {
    this.intervalID = setInterval(() => {
      let content = {
        eda: Math.floor(Math.random() * 40) + 10, //random 10-50
        bvp: Math.floor(Math.random() * 20) + 50 //random 50-70
      };
      this.broker.publish({
        properties: { source: 'simulated-device' },
        content: utf8.encode(content)
      });
    }, 500);
  },

  receive: function (message) { },

  destroy: function () {
    if (this.intervalID !== -1)
      clearInterval(this.intervalID)
  }
}
