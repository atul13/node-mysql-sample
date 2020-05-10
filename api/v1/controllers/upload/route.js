const express = require('express');
const auth = require('../../auth/Auth');
const UploadCtrl = require('./uploadCtrl');
const path = require("path");
const route = express.Router();

route
  .post('/upload',auth.verifyToken, UploadCtrl.upload)


module.exports = route;
