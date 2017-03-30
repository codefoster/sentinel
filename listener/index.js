let deviceAmqp = require('azure-iot-device-amqp');
var device = require('azure-iot-device');
var deviceConnectionString = 'HostName=sentinel-hack2017.azure-devices.net;DeviceId=gateway;SharedAccessKey=zgbBUYVXEoxyIRpdz4LjppMNmjrMe6vPV4rMYxmaNj0=';
var client = deviceAmqp.clientFromConnectionString(deviceConnectionString);

var exec = require('child_process').execSync;

client.open(err => {
    //handle C2D messages
    client.on('message', msg => {
        console.log('Stopping snort');
        exec('sudo kill -9 `pidof snort`');
        exec('rm -f /home/pi/snort_logs/alert');
        console.log('Starting snort drop'); 
        exec('sudo snort -N -d -D -l /home/pi/snort_logs -L test.log -s -c /etc/snort/rules/my_drop_rule.rules');
        client.complete(msg, () => console.log('Disconnecting device <--'));
    });

    // send a D2C message repeatedly
    // setInterval(function () {
    //     var message = new device.Message(JSON.stringify({
    //         deviceId: 'device1',
    //         value: Math.random()
    //     }));
    //     console.log('Sending D2C message -->');
    //     client.sendEvent(message, (err,res) => {});
    // }, 5000);
});
