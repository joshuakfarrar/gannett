'use strict';

var express = require('express');
var controller = require('./inputs.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/sum', controller.sum);
router.post('/', controller.create);

module.exports = router;
