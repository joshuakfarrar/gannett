'use strict';

const util = require('util');
const _ = require('lodash');

function NotFiniteNumberError(message) {
  Error.call(this);
  this.message = message;
}
util.inherits(NotFiniteNumberError, Error);

module.exports = (function() {
  var inputs = [];

  return {
    add: function(number) {
      if (Number.isFinite(number)) {
        inputs.push(number);
      } else {
        throw new NotFiniteNumberError('.add() only accepts finite numbers');
      }
    },
    getSum: function() {
      return _.sum(inputs);
    },
    getInputs: function() {
      return inputs;
    }
  }
});
