'use strict';

var rpc = require('../models/rpc')();

require('./app')(rpc).listen(5002);
