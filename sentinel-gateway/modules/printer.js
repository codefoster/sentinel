'use strict'

let utf8 = require('./util').utf8

module.exports = {
  broker: null,
  configuration: null,

  create: function (broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    return true
  },

  receive: function (message) {
    console.log(message.properties.type == "sentinel-message" ? "\nSENTINEL MESSAGE" : "\nMESSAGE");
      console.log(`Header: ${JSON.stringify(message.properties)}`);
      console.log(`Content: ${utf8.decode(message.content)}`)
  },

  destroy: function () { }
}
