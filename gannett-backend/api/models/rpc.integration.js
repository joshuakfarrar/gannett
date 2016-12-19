'use strict';

var rpcClient = require('./rpc')

describe('rpc client', function() {
  var rpc = rpcClient();

  it('adds a number', function() {
    return rpc.add(1.2).then(ok => {
      expect(ok).to.be.true;
    });
  });

  it('... but not if the number is not a number', function() {
    return rpc.add('hello world').then(ok => {
      expect(ok).to.be.false;
    });
  });

  it('returns inputs', function() {
    return rpc.getInputs().then(inputs => {
      expect(inputs).to.be.instanceOf(Array);
    });
  });

  it('returns a sum', function() {
    return rpc.getSum().then(sum => {
      expect(sum).to.be.a('number');
    });
  });
});
