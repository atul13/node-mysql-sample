const express = require('express');
const auth = require('../../auth/Auth');
const LogsCtrl = require('./LogsCtrl');
const route = express.Router();

route
  .post('/create', auth.verifyToken, LogsCtrl.createLog)

module.exports = route;
