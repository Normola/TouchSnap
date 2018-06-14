var amqp = require('amqplib/callback_api');

exports.cycle = function() {
    var input = [
        command = "cyclelights"
    ];
    
    var settings = {
        host: '192.168.1.107',
        port: 5672,
        login: 'jim',
        password: 'jim',
        connectionTimeout: 10000,
        vhost: '/',
        noDelay: true,
        ssl: { enabled: false }
    };

    var connection = "amqp://" + settings.login + ":" + settings.password + "@" + settings.host + ":" + settings.port; 
    
    amqp.connect(connection, function(err, conn) {
        if (err != undefined && err != '') {
            console.log(" [x] Error during connect: %s", err);
            bail(err);
        }
        conn.createChannel(function (err, ch) {
            if (err != undefined && err != '') {
                console.log(" [x] Error during createChannel: %s", err);
                bail(err);
            }
            var exchange = 'pythonCommandQueue';
            var commandJson = { command: "cycleLights" };

            ch.assertQueue(exchange, { durable: false });
            ch.sendToQueue(exchange, Buffer.from(JSON.stringify(commandJson)));

            console.log(" [o] Sent %s", command);
        });

        setTimeout(function() { conn.close(); process.exit(0); }, 500);
    });
};