const express = require('express');
const onboardingCtrl = require('./OnboardingCtrl');
const route = express.Router();

route
  .post('/onboarding', onboardingCtrl.addonboarding)
 

module.exports = route;
