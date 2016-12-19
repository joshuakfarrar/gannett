function handleAddInput(inputs) {
  verifyInputs(inputs);
  return function(ch, msg) {
    var n = parseFloat(msg.content.toString());
    inputs.add(n);
  }
}

function handleFetchInputs(inputs) {
  verifyInputs(inputs);
  return function(ch, msg) {
    ch.sendToQueue(msg.properties.replyTo,
      new Buffer(JSON.stringify(inputs.getInputs())),
      { correlationId: msg.properties.correlationId });
  }
}

function handleFetchSum(inputs) {
  verifyInputs(inputs);
  return function(ch, msg) {
    var sum = inputs.getSum();
    ch.sendToQueue(msg.properties.replyTo,
      new Buffer(sum.toString()),
      { correlationId: msg.properties.correlationId });
  }
}

function verifyInputs(inputs) {
  // ducktyping the inputs object
  if (typeof inputs !== 'object' ||
      typeof inputs.getSum !== 'function' ||
      typeof inputs.getInputs !== 'function' ||
      typeof inputs.add !== 'function') throw new Error('task only operates on an Inputs object');
}

module.exports = {
  handleAddInput: handleAddInput,
  handleFetchInputs: handleFetchInputs,
  handleFetchSum: handleFetchSum,
  verifyInputs: verifyInputs
}
