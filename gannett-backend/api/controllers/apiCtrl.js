'use strict';

const ERROR_NOT_A_NUMBER = `add api expects number to be a valid number`;
const ERROR_FAILED_TO_ADD_INPUTS = `failed to add new input`;
const ERROR_FAILED_TO_RETRIEVE_INPUTS = `failed to retrieve inputs`;
const ERROR_FAILED_TO_RETRIEVE_SUM = `failed to retrieve sum`;

function addInput(req, res, next) {
  var n = parseFloat(req.query.number);
  if (! Number.isFinite(n) ) return res.json({ error: ERROR_NOT_A_NUMBER });

  req.rpc.add(n).then(() => {
    return res.json({ status: 'OK' })
  }).catch(err => {
    return res.json({ error: ERROR_FAILED_TO_ADD_INPUTS })
  });
}

function fetchInputs(req, res, next) {
  req.rpc.getInputs().then(inputs => {
    return res.json({ inputs: inputs });
  }).catch(err => {
    return res.json({ error: ERROR_FAILED_TO_RETRIEVE_INPUTS })
  });
}

function fetchSum(req, res, next) {
  req.rpc.getSum().then(sum => {
    return res.json({ sum: sum });
  }).catch(err => {
    return res.json({ error: ERROR_FAILED_TO_RETRIEVE_SUM })
  });
}

module.exports = {
  addInput: addInput,
  fetchInputs: fetchInputs,
  fetchSum: fetchSum
}
