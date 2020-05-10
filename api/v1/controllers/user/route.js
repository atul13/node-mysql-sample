const express = require('express');
const auth = require('../../auth/Auth');
const UserCtrl = require('./UserCtrl');
const UserValidation = require('./UserValidation');
const route = express.Router();

route
  .post('/login', UserValidation.login, UserCtrl.login)
  .post('/checkUserExist', UserCtrl.checkEmailExist)
  .get('/getAllHostDetail', UserCtrl.getAllHostdetail)
  .post('/createGroup',  UserCtrl.create_group)
  .post('/addInterest',  UserCtrl.add_interest) 
  .get('/getAllGroupsWithInterest',  UserCtrl.get_groupInterest)
  .get('/getAllGroups',  UserCtrl.get_group)
  .get('/getAllCountry',  UserCtrl.getAllcountry)
  .get('/:countryId/getAllState', UserCtrl.getAllState)
  .get('/:groupId/getInterest',  UserCtrl.get_interest)
  .post('/adminLogin', UserValidation.login, UserCtrl.admin_login)
  .post('/adminPastSessionData', UserCtrl.admin_past_sessiondData)
  .post('/adminDashboardData', UserCtrl.admin_dashboardData)
  .post('/hostDashboardData', UserCtrl.host_dashboardData)
  .post('/hostPastDashboardData', UserCtrl.host_past_sessiondData)
  .post('/onDemandSession', UserCtrl.onDemandSessionData)
  .post('/register', UserValidation.register, UserCtrl.register)
  .post('/verify-otp', UserValidation.verifyOtp, UserCtrl.verifyOtp)
  .post('/resendOtp',  UserCtrl.resendOTP)
  .post('/client-token', UserCtrl.createClientToken)
  .post('/forgotpassword', UserCtrl.forgotPassword)
  .post('/verify-link', UserCtrl.verifyLink)
  .put('/update-password', UserCtrl.updatePassword)
  .get('/user-detail', auth.verifyToken, UserCtrl.userDetail)
  .post('/verifyparticipantEmail', UserCtrl.verifyParticipantEmail)
  .post('/inviteUser',  UserCtrl.tempRegister)
  .post('/verify-email', UserCtrl.verifyEmail)
  .post('/userToken', UserCtrl.getuserTokenDetail)
  .post('/rollChange',auth.verifyToken, UserCtrl.changeUserRole)
  .post('/onBoarding', UserCtrl.onBoardingUser)
  .post('/onBoardingMail',UserCtrl.onBoardingUserMail)
  .get('/:sessionId/getAllSignupParticipant', UserCtrl.getAllSignup)
  

module.exports = route;
