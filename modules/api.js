'use strict';

let restify = require('restify');
let utf8 = require('./util').utf8

module.exports = {
    broker: null,
    configuration: null,

    create: function (broker, configuration) {
        this.broker = broker;

        //TODO: hard code mac address for now
        this.configuration = configuration;

        let server = restify.createServer();
        server.use(restify.bodyParser());
        server.post('/api/messages', (req, res, next) => {
            this.broker.publish({
                properties: {
                    'source': 'api'
                },
                content: utf8.encode(req.body)
            });
        });
        server.listen(3000);

        return true;
    },

    receive: function (message) { },

    destroy: function () {
        console.log('api.destroy');
    }
};
