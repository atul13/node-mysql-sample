const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const axios = require("axios");
const moment = require("moment");
var moment1 = require('moment-timezone');
const sessionModel = require('../../models/Session');
const userModel = require('../../models/User');
const utils = require(process.cwd() + '/util/Utils');
const response = require(process.cwd() + '/util/Response');
const SendMail = require(process.cwd() + '/util/SendMail');
const newsletterModel = require('../../models/Newsletter');
const defaultConfig = require(process.cwd() + '/config/default.config');

const saltRounds = 10;

class EmailCtrl {
	
	async userDetail(req, res) {
	    try {
			let user1 = await userModel.getUserById(req.currentUser.id);
			// res.status(200).send(user1);
			response.resp(res, 200, user1)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async NotificationMailsendByHost(req, res) {
		
		try {		
			let sessionId=req.body.sessionid;
			let link = process.env.APP_PATH;
			// console.log("send By Host->>>>>>>",req.body.sessionid);
			
			// let userObj = await userModel.getExistsUserByEmail(email);
			let sessionObj = await newsletterModel.findSessionUsersParticipant(sessionId);

			let sessionDatares = await sessionModel.getSessionDetailBySessionId(sessionId);

			let sessionStartTime = new Date(sessionDatares.scheduleDate);
			
			let timezone22='';
			if(false === isEmpty(sessionDatares.timeZone))
			{
				console.log('--------yes---------')
				timezone22 = sessionDatares.timeZone;
			}else {
				console.log('--------no---------')
				timezone22 = "America/New_York";
			}

			let localeSpecificTime = sessionStartTime.toLocaleTimeString('en-US', {timeZone: timezone22});
			let localeSpecificTime1=localeSpecificTime.replace(/:\d+ /, ' ');
			let zoneAbbr=moment1.tz(timezone22).format('z');
			console.log('------nyyyyyyyyyyyyy---',zoneAbbr)

			 //console.log("CHECK BY HOST =====", sessionObj);
			if(!isEmpty(sessionObj)){
				let i;
				for(i=0; i<sessionObj.length; i++)
				{

					console.log("sessionOBJ : ",sessionObj[i].email," | LENGTH ==",sessionObj.length);
					// let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 510px; padding: 20px 15px 20px 15px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"> <p style="font-size: 20px; text-align: center; color: white;">Hi '+sessionObj[i].firstName+', your session  with '+sessionObj[i].hostfName+' starts in few minutes. If you plan to participate in the session using a browser, click on the link below. You can also log into Virdio.com and from your dashboard press the JOIN button. To join the session from your mobile device or tablet, launch the Virdio App on your device and log in.</p></div><p style="font-size: 20px; text-align: center; margin-top: 50px;"><a href="'+link+'" style="padding:10px 25px; background-color: #b80df7; text-decoration: none; color: white;">JOIN SESSION</a></p></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';

					let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 510px; padding: 20px 15px 20px 15px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"> <p style="font-size: 20px; text-align: center; color: white;">Hi '+sessionObj[i].firstName+', your session  '+sessionDatares.name+' at '+localeSpecificTime1+' '+zoneAbbr+' with '+sessionObj[i].hostfName+' starts in few minutes. Click on the link below on the device you want to attend the session.</p></div><p style="font-size: 20px; text-align: center; margin-top: 50px;"><a href="'+link+'" style="padding:10px 25px; background-color: #b80df7; text-decoration: none; color: white;">JOIN SESSION</a></p></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';

					let to=sessionObj[i].email;
					let subject='Your session with ' +sessionObj[i].hostfName+ ' starts soon on Virdio. Ignore if you have already Joined.';
					let sendmail = SendMail.emailInput(to,subject,html);
				}
				response.resp(res, 200, {msg:"A mail sent"})
			}else{
				let msg="Session Host does not exists. "+sessionObj[0].email;
				response.resp(res, 417, msg)			
			}
				
		} catch(exception) {
			  console.log('------SESSIONEXCEPTION-----',exception);
			response.resp(res, 500, exception);
		}
	}

	/****Participant email notification */

	async NotificationMailsendByparticipant(req, res) {
		
		try {		
				
			let sessionId=req.body.sessionid;

			// console.log("checkEMAIL---------",req.body.sessionid);
			
			// let userObj = await userModel.getExistsUserByEmail(email);
			let sessionObj = await newsletterModel.findSessionUsersHost(sessionId);
            let link = process.env.APP_PATH;
			console.log("CHECK PARTICIPANT ====>>>",sessionObj[0].email);

			if(!isEmpty(sessionObj)){
			
				// let link =sessionObj[0].sessionLink;
				//link = iosLink ;
			
			
			let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 510px; padding: 20px 15px 20px 15px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"> <p style="font-size: 20px; text-align: center; color: white;">Hi '+sessionObj[0].firstName+', your session is about to start, your clients are already logging in. Click on the link below to log into the session.</p><p style="font-size: 20px; text-align: center; color: white;"> To join the session from your mobile device or tablet, launch the Virdio App on your device and log in.</p></div><p style="font-size: 20px; text-align: center; margin-top: 50px;"><a href="'+link+'" style="padding:10px 25px; background-color: #b80df7; text-decoration: none; color: white;">Log into the session</a></p></div><p style="color: white; font-size: 22px; margin-top: 40px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';

			let to=sessionObj[0].email;
			let subject='Your session is starting soon';
			let text='Your session is starting soon';

			let sendmail = SendMail.emailInput(to,subject,html);	
			
		response.resp(res, 200, {msg:"A mail sent"})
			}else{
				let msg="session Participant Does not exists.";
				response.resp(res, 417, msg)
			
			}
		 } catch(exception) {
			response.resp(res, 500, exception);
		}
	}


}

module.exports = new EmailCtrl();