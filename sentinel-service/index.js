var iothub = require('azure-iothub');
var common = require('azure-iot-common');
let eventhubs = require('azure-event-hubs');

var ehConnectionString = process.env.EVENTHUB_CONNECTION_STRING;
var hubConnectionString = process.env.IOTHUB_CONNECTION_STRING;
var eventhubsClient = eventhubs.Client.fromConnectionString(ehConnectionString);
var iothubClient = iothub.Client.fromConnectionString(hubConnectionString);

function logMessage(msg) {
    console.log('--> Sentinel message received <--');
    console.log('From: ' + msg.annotations['iothub-connection-device-id'])
    console.log('-- Properties --');
    console.log(JSON.stringify(msg.applicationProperties, null, 2));
    console.log('-- Payload --');
    console.log(JSON.stringify(msg.body, null, 2));
    console.log('---------------------------------');
}

//open event hubs client for handling D2C messages
eventhubsClient.open()
  .then(() => console.log('ready'))
  .then(() => eventhubsClient.getPartitionIds())
  .then(pids => {
    //enumerate the partitions
    pids.map(pid => {
      eventhubsClient.createReceiver('$Default', pid, { 'startAfterTime': Date.now() })
        .then(receiver => {
          //handle Sentinel messages
          receiver.on('message', msg => {
            var gatewayId = msg.annotations['iothub-connection-device-id'];
            logMessage(msg);

            // Service or Operator decides on the appopriate action and sends it back to the gateway
            var responseMessage = new iothub.Message(JSON.stringify({
              action: 'block',
              device: msg.properties[deviceName]
            }));

            iothubClient.open(err => {
              if (err) console.error(err.toString());
              iothubClient.send(gatewayId, responseMessage, err => {
                if (err) console.error(err.toString());
              });
            });
          });
        }).catch(err => console.error(err.toString()))
    });
  });
