'use strict'

let Rx = require('rxjs/Rx')
let utf8 = require('./util').utf8
let tokenbucket = require('./sentinel-tokenbucket');

class SentinelMeterModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.messages = new Rx.Subject()
    this.subscription = this.messages
        //add any interesting Rx operators here (i.e. .map, .filter)
      .subscribe(msg => {
        //build and send a sentinel message
        let sentinelMessage = {
          properties: {
            source:'sentinel-meter',
            type:'sentinel-message'
          },
          content: utf8.encode('TBD')
        };
        this.broker.publish(sentinelMessage);

        //pass on the original message (may want to make this conditional)
        this.broker.publish(msg);

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

module.exports = new SentinelMeterModule()
