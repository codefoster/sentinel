var iothub = require('azure-iothub');
var common = require('azure-iot-common');
let eventhubs = require('azure-event-hubs');

var connectionString = process.env.EVENTHUB_CONNECTION_STRING;
var eventhubsClient = eventhubs.Client.fromConnectionString(connectionString);

//open event hubs client for handling D2C messages
eventhubsClient.open()
    .then(() => console.log('ready'))
    .then(() => eventhubsClient.getPartitionIds())
    .then(pids =>
        //enumerate the partitions
        pids.map(pid =>
            eventhubsClient.createReceiver('$Default', pid, { 'startAfterTime': Date.now() })
                .then(receiver =>
                    //handle Sentinel messages
                    receiver.on('message', msg => {
                        console.log('--> Sentinel message received <--');
                        console.log('-- Properties --');
                        console.log(JSON.stringify(msg.applicationProperties, null, 2));
                        console.log('-- Payload --');
                        console.log(JSON.stringify(msg.body, null, 2));
                        console.log('---------------------------------');
                        
                    })
                )
        )
    );