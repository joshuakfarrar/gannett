'use strict';

let QUEUE_TEST = 'test';

var URL = process.env.URL || 'amqp://localhost';

var backend = require('./backend');

describe('Backend server', () => {
  var server, amqp, conn;

  before((done) => {
    amqp = require('amqplib').connect(URL).then((open) => {
      conn = open;
      done();
    });
  });

  after((done) => {
    conn.close();
    done();
  });

  beforeEach((done) => {
    backend(URL).then(s => {
      server = s;
      done();
    });
  });

  afterEach((done) => {
    server.disconnect();
    done();
  });

  it('calls an abitrary function registered to a queue event type', () => {
    conn.createChannel().then(ch => {
      return ch.assertQueue(QUEUE_TEST).then(ok => {
        return ch.sendToQueue(QUEUE_TEST, new Buffer("hello world"));
      });
    });

    return new Promise((resolve, reject) => {
      server.on(QUEUE_TEST, (ch, msg) => {
        expect(msg.content.toString()).to.equal("hello world");
        ch.ack(msg);
        resolve();
      });
    });
  });

});
