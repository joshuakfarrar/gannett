'use strict';

let ADD_INPUT = 'add';
let FETCH_INPUTS = 'inputs';
let FETCH_SUM = 'sum';

var URL = process.env.URL || 'amqp://localhost';

module.exports = require('./lib/backend')(URL).then(function(server) {
  var inputs = require('./lib/models/inputs')();
  var tasks = require('./lib/tasks');

  server.on(ADD_INPUT, tasks.handleAddInput(inputs));
  server.on(FETCH_SUM, tasks.handleFetchSum(inputs));
  server.on(FETCH_INPUTS, tasks.handleFetchInputs(inputs));

  process.on('SIGINT', function() {
    server.disconnect();
    process.exit();
  });
});
