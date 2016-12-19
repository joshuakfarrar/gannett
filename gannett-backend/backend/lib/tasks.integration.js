'use strict';

let FETCH_INPUTS = 'test.inputs';
let FETCH_INPUTS_REPLY = 'test.inputs-reply';

let FETCH_SUM = 'test.sum';
let FETCH_SUM_REPLY = 'test.sum-reply';

let ADD_INPUT = 'test.add';

var URL = process.env.URL || 'amqp://localhost';

var backend = require('./backend');
var tasks = require('./tasks');
var Inputs = require('./models/inputs');

describe('Tasks', () => {
  var inputs, amqp, conn;

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

  describe('handleFetchInputs', () => {
    var server;

    before((done) => {
      inputs = Inputs();

      backend(URL).then(s => {
        server = s;
        done();
      });
    });

    after((done) => {
      server.disconnect();
      done();
    });

    it('returns an empty array of inputs when none have been added', () => {
      conn.createChannel().then(ch => {
        ch.assertQueue(FETCH_INPUTS).then(ok => {
          var corr = 'test';

          ch.sendToQueue(FETCH_INPUTS, new Buffer(''),
            { correlationId: corr, replyTo: FETCH_INPUTS_REPLY });

          ch.close();
        });
      });

      return new Promise((resolve, reject) => {
        server.on(FETCH_INPUTS, tasks.handleFetchInputs(inputs));

        conn.createChannel().then(ch => {
          ch.assertQueue(FETCH_INPUTS_REPLY).then(ok => {
            ch.consume(FETCH_INPUTS_REPLY, (msg) => {
              expect(msg.content.toString()).to.equal('[]');
              ch.ack(msg);
              ch.close();
              resolve();
            });
          });
        });
      });
    });

    describe('handleFetchSum', () => {
      var server;

      before((done) => {
        inputs = Inputs();

        backend(URL).then(s => {
          server = s;
          done();
        });
      });

      after((done) => {
        server.disconnect();
        done();
      });

      it('returns zero when no inputs have been added', () => {
        conn.createChannel().then(ch => {
          ch.assertQueue(FETCH_SUM).then(ok => {
            var corr = 'test';

            ch.sendToQueue(FETCH_SUM, new Buffer(''),
              { correlationId: corr, replyTo: FETCH_SUM_REPLY });

            ch.close();
          });
        });

        return new Promise((resolve, reject) => {
          server.on(FETCH_SUM, tasks.handleFetchSum(inputs));

          conn.createChannel().then(ch => {
            ch.assertQueue(FETCH_SUM_REPLY).then(ok => {
              ch.consume(FETCH_SUM_REPLY, (msg) => {
                expect(msg.content.toString()).to.equal('0');
                ch.ack(msg);
                ch.close();
                resolve();
              });
            });
          });
        });
      });
    });

    describe('handleAddInput', () => {
      var server;

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

      it('returns an array of inputs when a number has been added', () => {
        var inputs = Inputs();

        return new Promise((resolve, reject) => {
          server.on(ADD_INPUT, tasks.handleAddInput(inputs));
          server.on(FETCH_INPUTS, tasks.handleFetchInputs(inputs));
          
          conn.createChannel().then(ch => {
            ch.assertQueue(ADD_INPUT).then(ok => {
              // add a number to numbers
              ch.sendToQueue(ADD_INPUT, new Buffer('1'));

              // fetch the list of inputs
              ch.assertQueue(FETCH_INPUTS).then(ok => {
                var corr = 'test';

                ch.sendToQueue(FETCH_INPUTS, new Buffer(''),
                  { correlationId: corr, replyTo: FETCH_INPUTS_REPLY });

                ch.close();
              });

            });
          });

          conn.createChannel().then(ch => {
            ch.assertQueue(FETCH_INPUTS_REPLY).then(ok => {
              ch.consume(FETCH_INPUTS_REPLY, (msg) => {
                expect(inputs.getInputs()).to.deep.equal([1]);
                ch.ack(msg);
                ch.close();
                resolve();
              });
            });
          });
        });
      });

      it('returns an array of inputs when a float has been added', () => {
        return new Promise((resolve, reject) => {
          server.on(ADD_INPUT, tasks.handleAddInput(inputs));
          server.on(FETCH_INPUTS, tasks.handleFetchInputs(inputs));

          conn.createChannel().then(ch => {
            ch.assertQueue(ADD_INPUT).then(ok => {
              // add a number to numbers
              ch.sendToQueue(ADD_INPUT, new Buffer('1.5'));

              // fetch the list of inputs
              ch.assertQueue(FETCH_INPUTS).then(ok => {
                var corr = 'test';

                ch.sendToQueue(FETCH_INPUTS, new Buffer(''),
                  { correlationId: corr, replyTo: FETCH_INPUTS_REPLY });

                ch.close();
              });
            });
          });

          conn.createChannel().then(ch => {
            ch.assertQueue(FETCH_INPUTS_REPLY).then(ok => {
              ch.consume(FETCH_INPUTS_REPLY, (msg) => {
                expect(inputs.getInputs()).to.deep.equal([1.5]);
                ch.ack(msg);
                ch.close();
                resolve();
              });
            });
          });
        });
      });
    })
  });
});
