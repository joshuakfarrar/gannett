'use strict';

module.exports = (function(url) {
  var open;
  var amqp = require('amqplib').connect(url);

  return amqp.then(function(conn) {
    open = conn;
    return conn.createChannel();
  }).then(function(ch) {
    return {
      on: function(queue, msgHandler) {
        return ch.assertQueue(queue).then(ok => {
          return ch.consume(queue, (msg) => {
            if (msg === null) return;
            msgHandler(ch, msg);
            return ch.ack(msg);
          });
        });
      },
      disconnect: function() {
        return open.close();
      }
    }
  });
});
