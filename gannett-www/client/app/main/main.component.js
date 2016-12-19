import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import _ from 'lodash';

export class MainController {
  $http;

  inputs = [];
  newInput = '';
  sum = 0;

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/inputs')
      .then(response => {
        this.inputs = response.data;
      });
    this.$http.get('/api/inputs/sum')
      .then(response => {
        this.sum = response.data;
      });
  }

  addInput() {
    if(!this.newInput) {
      return false;
    }

    var n = parseFloat(this.newInput);
    if(!Number.isFinite(n)) {
      return false;
    }

    this.inputs.push(n);
    this.sum = _.sum(this.inputs);

    this.$http.post('/api/inputs', {
      input: this.newInput
    });
    this.newInput = '';
  }
}

export default angular.module('gannettWwwApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
