const express = require('express');
const RecordCtrl = require('./RecordCtrl');
const route = express.Router();

route
  .post('/uploadFile', RecordCtrl.uploadFile)

module.exports = route;
