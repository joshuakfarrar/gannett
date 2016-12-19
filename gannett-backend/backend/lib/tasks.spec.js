'use strict';

var tasks = require('./tasks');
var Inputs = require('./models/inputs');

describe('tasks', function() {
  var inputs;

  describe('handleAddInput', function() {
    beforeEach(function(done) {
      inputs = Inputs();
      done();
    })

    it('throws an error if Inputs object is not passed', function() {
      expect(tasks.handleAddInput.bind(tasks, {})).to.throw(Error)
    });

    it('returns a callable function if it has a valid inputs object to operate on', function() {
      expect(tasks.handleAddInput(inputs)).to.be.instanceOf(Function)
    });

    it('adds a finite number to inputs from messages', function() {
      var inputs = {
        add: sinon.spy(),
        getSum: function() {},
        getInputs: function() {}
      }

      var msg = { content: new Buffer('1.2') },
        handler = tasks.handleAddInput(inputs);

      handler({}, msg);

      sinon.assert.calledOnce(inputs.add);
      sinon.assert.calledWith(inputs.add, 1.2);
    });
  });

  describe('handleFetchInputs', function() {
    it('throws an error if Inputs object is not passed', function() {
      expect(tasks.handleFetchInputs.bind(tasks, {})).to.throw(Error)
    });

    it('returns a callable function if it has a valid inputs object to operate on', function() {
      expect(tasks.handleFetchInputs(inputs)).to.be.instanceOf(Function)
    });

    it('attempts to send a reply message to the client', function() {
      var inputs = Inputs();
      var stub = sinon.stub(inputs, 'getInputs', () => {
        return [1, 2, 3];
      });

      var ch = {
        sendToQueue: sinon.spy()
      }

      var msg = {
        content: new Buffer(''),
        properties: {
          replyTo: 'test',
          correlationId: 'test'
        }
      },
      handler = tasks.handleFetchInputs(inputs);

      handler(ch, msg);

      sinon.assert.calledOnce(inputs.getInputs);
      sinon.assert.calledOnce(ch.sendToQueue);
    });
  });

  describe('handleFetchSum', function() {
    it('throws an error if Inputs object is not passed', function() {
      expect(tasks.handleFetchSum.bind(tasks, {})).to.throw(Error)
    });

    it('returns a callable function if it has a valid inputs object to operate on', function() {
      expect(tasks.handleFetchSum(inputs)).to.be.instanceOf(Function)
    });

    it('attempts to send a reply message to the client', function() {
      var inputs = Inputs();
      var stub = sinon.stub(inputs, 'getSum', () => {
        return [123];
      });

      var ch = {
        sendToQueue: sinon.spy()
      }

      var msg = {
        content: new Buffer(''),
        properties: {
          replyTo: 'test',
          correlationId: 'test'
        }
      },
      handler = tasks.handleFetchSum(inputs);

      handler(ch, msg);

      sinon.assert.calledOnce(inputs.getSum);
      sinon.assert.calledOnce(ch.sendToQueue);
    });
  });

  describe('verifyInputs', () => {
    it('throws an error if the inputs object does not have an add method', function() {
      var inputs = Inputs();
      delete inputs.add;

      expect(tasks.verifyInputs.bind(tasks.verifyInputs, inputs)).to.throw(Error);
    });

    it('throws an error if the inputs object does not have a getSum method', function() {
      var inputs = Inputs();
      delete inputs.getSum;

      expect(tasks.verifyInputs.bind(tasks.verifyInputs, inputs)).to.throw(Error);
    });

    it('throws an error if the inputs object does not have an add method', function() {
      var inputs = Inputs();
      delete inputs.getInputs;

      expect(tasks.verifyInputs.bind(tasks.verifyInputs, inputs)).to.throw(Error);
    });
  })
});
