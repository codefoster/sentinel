'use strict'

let utf8 = require('./util').utf8
let Tail = require('./tail').Tail;

class SentinelTailModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.tail = new Tail(this.configuration.filePath);
    this.tail.on('line', data => {
      let sentinelMessage = {
        properties: {
          source:'sentinel-tail',
          logFile: this.configuration.filePath,
          type:'sentinel-message',
        },

        content: utf8.encode(data)
      };

      this.broker.publish(sentinelMessage);
    });

    this.tail.on('error', err => {
      console.log('sentinel-tail module failure: ' + err.toString());
    });

    tail.watch();
    return true;
  }

  receive(msg) {
    this.messages.next(msg)
  }

  destroy() {
    if (!!this.tail) {
      this.tail.unwatch();
    }
    this.subscription.unsubscribe()
  }
}

module.exports = new SentinelTailModule();
