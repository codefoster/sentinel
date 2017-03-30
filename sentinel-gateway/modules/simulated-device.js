'use strict'

let utf8 = require('./util').utf8

module.exports = {
  broker: null,
  configuration: null,
  intervalID: -1,

  create: function (broker, configuration) {
    this.broker = broker;
    this.configuration = configuration;
    this.i = 0;
    return true;
  },

  start: function () {
    let devices = ['01:01:01:01:01:01', '01:01:01:01:01:02', '01:01:01:01:01:03', '01:01:01:01:01:04'];
    this.intervalID = setInterval(() => {
      let content = {
        property1: Math.random(),
        property2: this.i++
      };
      this.broker.publish({
        properties: {
          source: 'simulated-device',
          macAddress: devices[Math.floor(Math.random() * devices.length)]
        },
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
