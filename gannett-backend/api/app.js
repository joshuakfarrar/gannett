'use strict';

module.exports = (function(rpc) {
  var express = require('express');
  var app = express();

  app.use(function(req, res, next) {
    req.rpc = rpc;
    next();
  });

  require('./routes')(app);

  return app;
});
