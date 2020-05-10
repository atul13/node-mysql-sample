const express = require('express');
// const auth = require('../../auth/Auth');
const newsletterCtrl = require('./NewsletterCtrl');
const emailCtrl = require('./EmailCtrl');
const route = express.Router();

route
  .post('/newsletter', newsletterCtrl.addnewsletter)
  .get('/:code/checkcode', newsletterCtrl.check_invitecode)
  .post('/invite', newsletterCtrl.invite)
  .post('/hostmail', emailCtrl.NotificationMailsendByHost)
  .post('/participantmail', emailCtrl.NotificationMailsendByparticipant)
 

module.exports = route;
