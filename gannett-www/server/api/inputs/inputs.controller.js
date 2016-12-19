'use strict';

import Input from './input.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function index(req, res) {
  return Input.getAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function sum(req, res) {
  return Input.getSum()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function create(req, res) {
  return Input.addInput(req.body.input)
    .then(respondWithResult(res))
    .catch(handleError(res));
}
