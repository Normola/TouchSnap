var amqp = require('amqplib/callback_api');

exports.cycleLights = function() {
    app.get('/dcyclelights', callD_cyclelights);

    function callD_cyclelights(req, res) {
        var input = [
            req.command = "cyclelights"
        ];
        
        // TODO: Parameterise this.
        amqp.connect('amqp://192.168.1.107', function (err, conn) {
            conn.createChannel(function (err, ch) {
                ch.assertQueue('pythonCommandQueue', { durable: false });
                ch.assertQueue('pythonResults', { durable: false });

                ch.sendToQueue('pythonCommandQueue', new Buffer(JSON.stringify(input)));
                ch.consume('pythonResults', function(msg) {
                    res.send(msg.content.toString());
                }, { noAck: true });
            });
            setTimeout( function() { conn.close(); }, 500);
        });
    }
};