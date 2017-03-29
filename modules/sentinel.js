'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8
let tokenbucket = require('./sentinel-tokenbucket');

class SentinelModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
      .subscribe(msg => {
        //do something interesting here with the token bucket module
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

module.exports = new SentinelModule()
