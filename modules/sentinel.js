'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8

class BatchModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
      //do interesting things here
      .subscribe(msg => {
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

module.exports = new BatchModule()
