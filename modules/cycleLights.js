var amqp = require('amqplib/callback_api');

exports.cycle = function() {
    var input = [
        command = "cyclelights"
    ];
    
    // TODO: Parameterise this.
    amqp.connect('amqp://localhost', function (err, conn) {
        console.error(err);
        conn.createChannel(function (err, ch) {
            ch.assertQueue('pythonCommandQueue', { durable: false });
            ch.assertQueue('pythonResults', { durable: false });

            ch.sendToQueue('pythonCommandQueue', new Buffer.from(JSON.stringify(input)));
            ch.consume('pythonResults', function(msg) {
                res.send(msg.content.toString());
            }, { noAck: true });
        });
        setTimeout( function() { conn.close(); }, 500);
    });
};