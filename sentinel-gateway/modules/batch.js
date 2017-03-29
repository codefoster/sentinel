'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8

class BatchModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
      .map(m => JSON.parse(utf8.decode(m.content)))
      .bufferTime(this.configuration.batch_time)
      .subscribe(b => {
        this.broker.publish({
          properties: Object.assign(b[0], { source: 'batch' }),
          content: utf8.encode(b)
        })
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

module.exports = new BatchModule()
