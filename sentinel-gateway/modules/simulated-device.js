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
    let devices = ['device00', 'device01', 'device02', 'device03'];
    this.intervalID = setInterval(() => {
      let content = {
        property1: Math.random(),
        property2: Math.random()
      };
      this.broker.publish({
        properties: {
          source: 'simulated-device',
          deviceId: devices[Math.floor(Math.random() * devices.length)]
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
