'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8

class SentinelAnalyzerModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
      .filter(msg => msg.properties.type == 'sentinel-message')
      .subscribe(msg => {
        //do something interesting here with sentinel messages
        this.broker.publish(msg)
      });
    return true;
  }

  receive(msg) {
    this.messages.next(msg)
  }

  destroy() {
    this.subscription.unsubscribe()
  }
}

module.exports = new SentinelAnalyzerModule()
