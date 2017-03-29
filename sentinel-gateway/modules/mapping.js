'use strict'

class MappingModule {
  create(broker, configuration) {
    this.broker = broker
    this.configuration = configuration
    return true
  }

  receive(msg) {
    msg.properties.source = "mapping";
    msg.properties.deviceName = this.configuration.deviceName;
    msg.properties.deviceKey = this.configuration.deviceKey;
    this.broker.publish(msg);
  }

  destroy() {}
}

module.exports = new MappingModule()
