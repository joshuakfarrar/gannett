'use strict';

import _ from 'lodash';
import request from 'supertest';
import Promise from 'bluebird';

var rpc = {
  getInputs: function() {
    return new Promise(function(resolve, reject) {
      return resolve([]);
    });
  },
  add: function(n) {
    return new Promise(function(resolve, reject) {
      return resolve();
    });
  },
  getSum: function() {
    return new Promise(function(resolve, reject) {
      return resolve(0);
    });
  }
}

// app with overridden rpc behaviors
var app = require('../app')(rpc);

describe('API:', function() {
  describe('GET /api/v1/inputs', function() {
    var body;

    before(function(done) {
      request(app)
        .get('/api/v1/inputs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          body = res.body;
          done();
        });
    });

    it('should respond with an JSON array', function(done) {
      var inputs = _.get(body, 'inputs');
      expect(inputs).to.be.deep.equal([]);
      expect(inputs).to.be.instanceOf(Array);
      done();
    });
  });

  describe('GET /api/v1/sum', function() {
    var body;

    before(function(done) {
      request(app)
        .get('/api/v1/sum')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          body = res.body;
          done();
        });
    });

    it('should respond with a finite number', function(done) {
      var sum = _.get(body, 'sum');
      expect(sum).to.be.equal(0);
      done();
    });
  });

  describe('POST /api/v1/add', function() {
    it('should respond OK if number is valid', function(done) {
      request(app)
        .post(`/api/v1/add?number=5`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          expect(res.body.status).to.equal('OK');
          done();
        });
    });

    it('should respond with an error if number is invalid', function(done) {
      request(app)
        .post(`/api/v1/add?number=abc`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          expect(res.body.error).to.equal('add api expects number to be a valid number');
          done();
        });
    });
  });

});
