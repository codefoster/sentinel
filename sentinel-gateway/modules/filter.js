'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8

class FilterModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
      .filter(msg => {
        msg = JSON.parse(utf8.decode(msg.content))
        return msg.eda >= this.configuration.eda_min && msg.eda <= this.configuration.eda_max
      })
      .subscribe(msg => {
        this.broker.publish(msg)
      })
    return true
  }

  receive(msg) {
    this.messages.next(msg)
  }

  destroy() {
    this.subscription.unsubscribe()
  }
}

module.exports = new FilterModule()
