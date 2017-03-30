'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8

class SentinelMeterModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
      .groupBy(msg => msg.deviceId)
      .subscribe(devices => {
        devices.subscribe(msg => {
          let content = JSON.parse(utf8.decode(msg.content));
          if (content.property1 < 0.15) {
            //build and send a sentinel message
            this.broker.publish({
              properties: Object.assign(msg.properties, {
                macAddress: '00:00:00:00:00:00',
                source: 'sentinel-meter',
                type: 'sentinel-message'
              }),
              content: utf8.encode('TBD')
            });
          }

          //pass on the original message (may want to make this conditional)
          this.broker.publish(msg);
        })
      })
    return true;
  }

  receive(msg) {
    this.messages.next(msg)
  }

  destroy() {
    this.subscription.unsubscribe()
  }
}

module.exports = new SentinelMeterModule()
