'use strict';

const uuidV4 = require('uuid/v4');

const QUEUE_ADD = 'add';

const QUEUE_SUM = 'sum';
const REPLY_SUM = 'reply_sum';

const QUEUE_INPUTS = 'inputs';
const REPLY_INPUTS = 'reply_inputs';

module.exports = (function() {
  var amqp = require('amqplib').connect('amqp://localhost');

  var callbacks = {};

  amqp.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {

    setupQueueConsumer(REPLY_INPUTS, handleMessage);
    setupQueueConsumer(REPLY_SUM, handleMessage);

    function setupQueueConsumer(queue, msgHandler) {
      return ch.assertQueue(queue).then(ok => {
        return ch.consume(queue, msgHandler);
      });
    }

    function handleMessage(msg) {
      if (msg === null) return false;
      var cb = callbacks[msg.properties.correlationId] || function() {};
      cb(msg.content.toString());
    }
  });

  return {
    add: function(n) {
      return amqp.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        if (!Number.isFinite(n)) { throw new Error('not a number'); }
        return ch.assertQueue(QUEUE_ADD).then(function(ok) {
          return ch.sendToQueue(QUEUE_ADD, new Buffer(n.toString()));
        });
      }).then(function() {
        return true;
      })
      .catch(function() {
        return false;
      });
    },
    getInputs: function() {
      return amqp.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return new Promise((resolve, reject) => {
          var corr = uuidV4();

          callbacks[corr] = function(inputs) {
            resolve(JSON.parse(inputs));
            ch.close();
          }

          ch.assertQueue(QUEUE_INPUTS).then(function(ok) {
            ch.sendToQueue(QUEUE_INPUTS, new Buffer(''),
              { correlationId: corr, replyTo: REPLY_INPUTS });
          });
        });
      })
      .then((inputs) => {
        return inputs;
      })
      .catch(console.warn);
    },
    getSum: function() {
      return amqp.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return new Promise((resolve, reject) => {
          var corr = uuidV4();

          callbacks[corr] = function(sum) {
            resolve(sum);
            ch.close();
          }

          ch.assertQueue(QUEUE_SUM).then(function(ok) {
            ch.sendToQueue(QUEUE_SUM, new Buffer(''),
              { correlationId: corr, replyTo: REPLY_SUM });
          });
        });
      })
      .then((sum) => {
        return parseFloat(sum);
      })
      .catch(console.warn);
    }
  }
});
