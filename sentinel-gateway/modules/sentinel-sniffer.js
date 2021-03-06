'use strict'

let utf8 = require('./util').utf8
let Tail = require('tail').Tail;

class SentinelSnifferModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    this.tail = new Tail(this.configuration.filePath);
    this.tail.on('line', data => {
      console.log(data);
      let sentinelMessage = {
        properties: {
          source:'sentinel-sniffer',
          logFile: this.configuration.filePath,
          type:'sentinel-message',
        },

        content: utf8.encode(data)
      };

      this.broker.publish(sentinelMessage);
    });

    this.tail.on('error', err => {
      console.log('sentinel-sniffer module failure: ' + err.toString());
    });

    this.tail.watch();
    return true;
  }

  receive(msg) {
  }

  destroy() {
    if (!!this.tail) {
      this.tail.unwatch();
    }
  }
}

module.exports = new SentinelSnifferModule();
