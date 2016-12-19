'use strict';

var apiCtrl = require('./controllers/apiCtrl');

module.exports = function(app) {
  app.post('/api/v1/add', apiCtrl.addInput);
  app.get('/api/v1/inputs', apiCtrl.fetchInputs);
  app.get('/api/v1/sum', apiCtrl.fetchSum);
}
