'use strict';

import rp from 'request-promise';

export default {
  getAll: function() {
    return rp('http://localhost:5002/api/v1/inputs')
      .then(resp => {
        try {
          var body = JSON.parse(resp);
          return body.inputs;
        } catch(e) {
          return new Error('no response');
        }
      });
  },
  getSum: function() {
    return rp('http://localhost:5002/api/v1/sum')
      .then(resp => {
        try {
          var body = JSON.parse(resp);
          return body.sum;
        } catch(e) {
          return new Error('no response');
        }
      });
  },
  addInput: function(input) {
    return rp({
      method: 'post',
      uri: `http://localhost:5002/api/v1/add?number=${input}`
    });
  }
};
