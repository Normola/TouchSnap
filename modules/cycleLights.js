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
        conn.createChannel(function (err, ch) {
            var exchange = 'pythonCommandQueue';
            var command = 'cycleLights';

            ch.assertExchange(exchange, 'fanout', { durable: false });
            ch.publish(exchange, '', Buffer.from(command));

            console.log(" [x] Sent %s", command);
        });

        setTimeout(function() { conn.close(); process.exit(0); }, 500);
    });
};