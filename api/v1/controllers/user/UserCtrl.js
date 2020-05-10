const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const axios = require("axios");
const moment = require("moment");
var moment1 = require('moment-timezone');
const userModel = require('../../models/User');
const CountryModel = require('../../models/country');
const tempusersModel = require('../../models/tempUsers');
const interestGroupModel = require('../../models/InterestGroup');
const interestModel = require('../../models/Interest');
const channelHostModel = require('../../models/ChannelHost');
const ChannelsModel = require('../../models/Channels');
const tokenModel = require('../../models/AuthToken');
const sessionModel = require('../../models/Session');
const sessionUserModel = require('../../models/SessionUser');
const settingModel = require('../../models/Settings');
const otpModel = require('../../models/Otp');
const SessionEquipmentMappingModel = require('../../models/SessionEquipmentMapping');
const SessionShoppingListModel = require('../../models/SessionShoppingList');
const sessionScriptModel = require('../../models/SessionScript');
const clientToken = require( process.cwd() + '/util/ClientToken');
const utils = require(process.cwd() + '/util/Utils');
const response = require(process.cwd() + '/util/Response');
const SendMail = require(process.cwd() + '/util/SendMail');
const defaultConfig = require(process.cwd() + '/config/default.config');

const saltRounds = 10;

class UserCtrl {

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

	async checkEmailExist(req, res) {
	    try {
	    	if (req.body.sessionId === undefined) {
				let userObj = await userModel.getExistsUserByEmail(req.body.email);
				userObj = underscore.omit(userObj, 'password');
				userObj = underscore.omit(userObj, 'status');

				response.resp(res, 200, userObj)
	    	} else {	    		

				let email = req.body.email;
				
				let sessionId = req.body.sessionId;
				let userObj = await userModel.getExistsUserByEmail(email);
				
				//if(userObj.length > 0){
				let getchId = await sessionModel.getchannelIdBysessionId(sessionId);
				let emailcheck = await sessionModel.checkMemberByEmail(email,getchId[0].sessionChannelId);
				// console.log('---------EMAIL CHECKDETAILS>>-----------',getchId[0].sessionChannelId)
				let pm = await sessionModel.isMember(sessionId,userObj.id);
				// console.log("MEMBERLENGHT=====>",pm.length);
				if(pm.length >0){
					underscore.extend(userObj, {privateMember : "yes"});
				}else{
					underscore.extend(userObj, {privateMember : "no"});
				}
				// console.log("MEMBERLENGHT=====>",pm.length,userObj);

				if(!isEmpty(userObj)){
					userObj = underscore.omit(userObj, 'password');
					userObj = underscore.omit(userObj, 'status');
			let sessionUserMem = await sessionUserModel.getUserSignupToSession(sessionId,userObj.id);
				//console.log('---------sessionUserMem.length-----------',sessionUserMem)
				if(sessionUserMem.length > 0)
				{				
					if(sessionUserMem[0].type == 1)
					{
						underscore.extend(userObj, {sameSessionExist : "sameHost"});
					}else{
						if(sessionUserMem[0].sessionStatus == 2)
						{
						let updateData = await sessionUserModel.updateSessionActiveStatus(sessionId,userObj.id);
						}
						underscore.extend(userObj, {sameSessionExist : "Yes"});
					}
					
				}else{

					let sessionDatares = await sessionModel.getSessionDetailBySessionId(sessionId);

				console.log('--------sessionDatares---------',sessionDatares)

				let sessionStartTime = new Date(sessionDatares.scheduleDate);

				let date = ("0" + sessionStartTime.getDate()).slice(-2);
				let month = ("0" + (sessionStartTime.getMonth() + 1)).slice(-2);
				let year = sessionStartTime.getFullYear();
				let hours = ("0" + sessionStartTime.getHours()).slice(-2);
				let minutes = ("0" + sessionStartTime.getMinutes()).slice(-2);
				let seconds = ("0" + sessionStartTime.getSeconds()).slice(-2);


				let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
				//console.log('---------currentDate-----------',currentDate)
				let sessionEndTime = new Date(sessionDatares.sessionEndDate);
				let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
				let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
		    	let year1 = sessionEndTime.getFullYear();
				let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
				let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
				let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);


				let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;
				//console.log('---------endDate-----------',endDate)
				let sessionExit = await sessionModel.getsessionExistAtSameTime(userObj.id,currentDate,endDate);
				//console.log('-----------sessionExit------------------',sessionExit)
				if(sessionExit.length < 1){

				let totalSignup = await sessionUserModel.getTotalSignup(sessionId);
			
				//console.log('-----------totalSignup------------',totalSignup.length)

				let sessionHost = await sessionUserModel.getSessionHost(sessionId);
				console.log('-----------sessionHost--------',sessionHost)
				let hostData=sessionHost[0];

				if(totalSignup.length < sessionDatares.maxAttendee)
				{
					let sessionUserData;
											
					sessionUserData = [[sessionId,userObj.id,2,0,1]]
				console.log('----------sessionId23333------------------',sessionUserData,totalSignup.length,sessionDatares.maxAttendee)

				//let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);

				let totalSignup11 = await sessionUserModel.getTotalSignup(sessionId);

				underscore.extend(userObj, {sameSessionExist : "No"});
				}else{
				
					let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
					let d = new Date(sessionDatares.scheduleDate);
					let timezone11 = '';
					if(false === isEmpty(sessionDatares.timeZone))
					{
						timezone11 = sessionDatares.timeZone;
					}else{
						timezone11 = "America/New_York";
					}

					let ny =sessionDatares.scheduleDate.toLocaleString("en-US", {timeZone: timezone11});
						//let d111 = new Date(ny);
						console.log('-------moment.tz("2013-11-18 11:55").zoneAbbr()---------')
						let zoneAbbr=moment1.tz(timezone11).format('z');
						console.log('------nyyyyyyyyyyyyy---',zoneAbbr)

					let dayName = days[d.getDay()];
					let localeSpecificTime = d.toLocaleTimeString('en-US', {timeZone: timezone11});
					let localeSpecificTime1=localeSpecificTime.replace(/:\d+ /, ' ');
					// let hours = d.getHours();
					// let minutes = d.getMinutes();
					// let ampm = hours >= 12 ? 'pm' : 'am';
					// hours = hours % 12;
					// hours = hours ? hours : 12; // the hour '0' should be '12'
					// minutes = minutes < 10 ? '0'+minutes : minutes;
					// let strTime = hours + ':' + minutes + ' ' + ampm;
					// let localeSpecificTime1=strTime;
				console.log('----date.toString() 22 ---',dayName,'-----',localeSpecificTime1);
				//console.log('-----------hostData--------',hostData)
					let html1='<body style="font-family:Arial, sans-serif;"><div style="box-shadow: 0px 0px 7px 2px #1c1c1c; background-color: #282828; max-width: 600px; padding-top: 30px; margin:auto; padding-bottom: 30px; box-sizing: border-box; background-color: #282828;"><div style="padding: 0px 40px; font-family:Arial, sans-serif;"> <div style="text-align: center; border-bottom: 1px solid #444444; padding-bottom: 20px; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+hostData.hostFirstName+',your session,"'+sessionDatares.name+'"  on '+dayName+' at '+localeSpecificTime1+' '+zoneAbbr+', is fully booked.</p><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';

						
					//console.log('-------html--------',html)

					let toemail=hostData.hostEmail;
					let subject1='Participant Maximumn Limit Reached!';
					let text1='Please Check ur Mail';

					let sendmail = await SendMail.emailInput(toemail,subject1,html1);

					underscore.extend(userObj, {sameSessionExist : "ParticipantLimitReached"});
				}
				}else{
					underscore.extend(userObj, {sameSessionExist : "alReadySession"});
					}
				}

					response.resp(res, 200, userObj)
				}else{

					let sessionDatares11 = await sessionModel.getSessionDetailBySessionId(sessionId);

					console.log('----------sessionDatares111111-----------',sessionDatares11)
					//let date = new Date(sessionDatares11.scheduleDate);

					let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
							let d = new Date(sessionDatares11.scheduleDate);

							let timezone22 = '';
							if(false === isEmpty(sessionDatares11.timeZone))
							{
								console.log('--------yes---------')
								timezone22 = sessionDatares11.timeZone;
							}else {
								console.log('--------no---------')
								timezone22 = "America/New_York";
							}

							let ny =sessionDatares11.scheduleDate.toLocaleString("en-US", {timeZone: timezone22});
							//let d111 = new Date(ny);
							console.log('-------moment.tz("2013-11-18 11:55").zoneAbbr()---------')
							let zoneAbbr=moment1.tz(timezone22).format('z');
							console.log('------nyyyyyyyyyyyyy---',zoneAbbr)

							let dayName = days[d.getDay()];
							let localeSpecificTime = d.toLocaleTimeString('en-US', {timeZone: timezone22});
							let localeSpecificTime1=localeSpecificTime.replace(/:\d+ /, ' ');
							// let hours = d.getHours();
							// let minutes = d.getMinutes();
							// let ampm = hours >= 12 ? 'pm' : 'am';
							// hours = hours % 12;
							// hours = hours ? hours : 12; // the hour '0' should be '12'
							// minutes = minutes < 10 ? '0'+minutes : minutes;
							// let strTime = hours + ':' + minutes + ' ' + ampm;
							// let localeSpecificTime1=strTime;
				console.log('----date.toString() 33 ---',dayName,'-----',localeSpecificTime1);

					let totalSignup22 = await sessionUserModel.getTotalSignup(sessionId);
							
					if(totalSignup22.length < sessionDatares11.maxAttendee)
					{	
						if(emailcheck.length > 0){ 
							let userMode = {'onlyMember':"yes"};
							let userObj = JSON.parse(JSON.stringify(userMode)); 
							console.log(userObj);
											
							response.resp(res, 200, userObj);
						}else{
							let newArr=null;
							response.resp(res, 200, newArr);
						}
						
						
						// let newArr=null;				
						// response.resp(res, 200, newArr)
					}else{

						let sessionHost11 = await sessionUserModel.getSessionHost(sessionId);
						//console.log('-----------sessionHost1111--------',sessionHost11)
						let hostData11=sessionHost11[0];

						let html11='<body style="font-family:Arial, sans-serif;"><div style="box-shadow: 0px 0px 7px 2px #1c1c1c; background-color: #282828; max-width: 600px; padding-top: 30px; margin:auto; padding-bottom: 30px; box-sizing: border-box; background-color: #282828;"><div style="padding: 0px 40px; font-family:Arial, sans-serif;"> <div style="text-align: center; border-bottom: 1px solid #444444; padding-bottom: 20px; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+hostData11.hostFirstName+',your session,"'+sessionDatares11.name+'" on '+dayName+' at '+localeSpecificTime1+' '+zoneAbbr+', is fully booked.</p><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';
						
						//console.log('-------html--------',html)
		
						let toemail1=hostData11.hostEmail;
						let subject11='Participant Maximumn Limit Reached!';
						let text11='Please Check ur Mail';
		
						let sendmail = await SendMail.emailInput(toemail1,subject11,html11);
						response.resp(res, 200, {sameSessionExist : "ParticipantLimitReached"})
					}
				
				}
			}				
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}

	async getAllSignup(req, res) {
	    try {
			let totalSignup = await sessionUserModel.getTotalSignup(req.params.sessionId);
			// res.status(200).send(user1);
			if(!isEmpty(totalSignup)){
			response.resp(res, 200, totalSignup)
			}else{
				let msg =[];
				response.resp(res, 200, msg)
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async getAllHostdetail(req, res) {
	    try {
			let userObj = await userModel.getExistsUser();
			// res.status(200).send(user1);
			response.resp(res, 200, userObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async getAllcountry(req, res) {
	    try {
			let countryObj = await CountryModel.getCountry();
			// res.status(200).send(user1);
			countryObj = underscore.omit(countryObj, 'status');
			countryObj = underscore.omit(countryObj, 'createdAt');
			
			response.resp(res, 200, countryObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async getAllState(req, res) {
	    try {
			let countryId=req.params.countryId;
			let stateObj = await CountryModel.getState(countryId);					
			response.resp(res, 200, stateObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async create_group(req, res) {
	    try {

			console.log('--------req.body----------',req.body)
	    	let name = req.body.group_name;
			let group = await interestGroupModel.addInterestGroup(name);
			// res.status(200).send(user1);
			response.resp(res, 200, group)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async get_groupInterest1(req, res) {
	    try {

			let groupWithInterest = await interestGroupModel.getGroupInterest();
				console.log('##############', groupWithInterest);
			
 			console.log('-----------newArr---------')
				let group = [];

				let nestedData1 = [];
				for(let j in groupWithInterest)
				{
					if(group.indexOf(groupWithInterest[j].groupName) > -1) {
						continue;
					} else {
						group.push(groupWithInterest[j].groupName);

						let groupName = groupWithInterest[j].groupName;
						
						let nestedData2 = [];

						nestedData2.push(groupWithInterest[j].groupName);
						nestedData2.push(groupWithInterest[j].groupId);
						let interestData1 = [];
						for(let k in groupWithInterest)
						{
							let interestData = [];
							if(groupName == groupWithInterest[k].groupName)
							{	
								//console.log('----------hello',groupWithInterest[k].interestName)															
								interestData.push(groupWithInterest[k].interestId);
								interestData.push(groupWithInterest[k].interestName);
								console.log('-------interestData---hello',interestData)
								interestData1.push(JSON.stringify(interestData));
							}
							

						}
						underscore.extend(nestedData2, {InterestList : interestData1});
					//	console.log('interest data@@@@@@@', interestData);
						//nestedData2[groupName] = [];
						//nestedData2[groupName].push(interestData);
						//nestedData2.push(interestData)
						nestedData1.push(nestedData2)
						console.log('interest data####', nestedData2);
					}
				}

				console.log('-----final nestedData2------------',nestedData1);

				//let str = utils.arrayToJSONObject(nestedData1);

				//console.log('-----final nestedData23------------',str);

				underscore.extend(nestedData1, {nestedData1});
				response.resp(res, 200, nestedData1);
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}



	async get_groupInterest(req, res) {
	    try {
			
			let group = await interestGroupModel.getGroupForInterest();

			console.log('-----group------',group)
			let newArr=[];
			for(let i in group)
			{
				let attrData=group[i];
				let interestList = await interestModel.getInterestByGroupId(attrData.id);
				underscore.extend(attrData, {interestList : interestList});

				newArr.push(attrData);
			}
 		
				response.resp(res, 200, newArr);
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}



	async get_group(req, res) {
	    try {
		//let userId=11;
			let groupWithInterest = await interestGroupModel.getGroup();

			console.log('-----groupWithInterest------------',groupWithInterest)

			// res.status(200).send(user1);

		
			response.resp(res, 200, groupWithInterest)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async get_interest(req, res) {
	    try {
		let groupId=req.params.groupId;
		console.log('-----groupId------',groupId)
			let groupWithInterest = await interestModel.getInterest(groupId);

			//console.log('-----groupWithInterest------------',groupWithInterest)

			// res.status(200).send(user1);
		
			response.resp(res, 200, groupWithInterest)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async add_interest(req, res) {
	    try {

			//console.log('--------req.body----------',req.body)
			let interest = req.body.interest;
			
			let insertData = {		
				code : interest.interestCode ? interest.interestCode :0,
				title : interest.title,
				groupId : interest.groupId,
				description : interest.description ? interest.description : 0,
				image : interest.image ? interest.image : 0,
				video : interest.video ? interest.video :0,
				haveShoppingList : interest.haveShoppingList == true ? 1 : 0,
				haveEquipment : interest.haveEquipment == true ? 1 : 0,
				haveProductList : interest.haveProductList == true ? 1 : 0,
				attendeesAreCalled : interest.attendeesAreCalled ? interest.attendeesAreCalled : Participent,
				virtualRoomIsCalled : interest.virtualRoomIsCalled ? interest.virtualRoomIsCalled : virtualRoom, 
				inProduction  : interest.inProduction ? interest.inProduction : 0
			};
			//console.log('----------insertData------------------',insertData)

			let group = await interestModel.addInterest(insertData);
			// res.status(200).send(user1);
			response.resp(res, 200, group)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async admin_login(req, res) {
	    try {
			//console.log('--------req.body----------',req.body)
			
	    	let email = req.body.email;
			let password = req.body.password;
			
			let userObj = await userModel.getUserListByEmail(email);
			//let userObj = await userModel.getUserByEmail(email);

			let sessionId=req.body.sessionId ? req.body.sessionId : 0;

			let scheduleDate=req.body.scheduleDate ? req.body.scheduleDate :"";
			let duration=req.body.duration ? req.body.duration : 0;

	    	let currentTS = Date.now();

			if(!isEmpty(userObj)){

    			if(userObj.isOtpVerified == 0){
				
					
					let msg = 'Your account created successfully, Please check';
					let encodedstring=utils.encodedString(4);
					let emailUpdate = await otpModel.add(userObj.id, encodedstring, 0);
					//console.log('------emailUpdate-------',emailUpdate)
					if(emailUpdate > 0){
						//msg += ' email for verification link';
						msg += ' email for OTP';
						// let html='<p>Hi '+participent.firstName+',  please enter the following code ['+encodedstring+'] on the verification screen.</p>';

						let html='<body style="font-family:Arial, sans-serif;"><div style="box-shadow: 0px 0px 7px 2px #1c1c1c; background-color: #282828; max-width: 600px; padding-top: 30px; margin:auto; padding-bottom: 30px; box-sizing: border-box;"><div style="padding: 0px 40px; font-family:Arial, sans-serif;"> <div style="text-align: center; border-bottom: 1px solid #444444; padding-bottom: 20px; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white; font-family:Avenir-Medium;">Hi '+userObj.firstName+', please enter the following code</p><p style="margin: 20px 0px; text-align: center;"><span style=" padding: 13px 30px; background-color: #bd00ff; color: white !important; font-size: 32px; text-decoration: none !important; border-radius: 10px; font-weight: bold;">'+encodedstring+'</span></p><p style="margin-bottom: 100px; font-size: 22px; text-align: center; color: white;">on the verification screen.</p><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';

					
						//console.log('-------html--------',html)
		
						let to=userObj.email;
						let subject='Your Virdio verification code!';
						let text='Please Check ur Mail';
		
						let sendmail = await SendMail.emailInput(to,subject,html);

					}

					userObj = underscore.omit(userObj, 'password');
					userObj = underscore.omit(userObj, 'isBanned');
					//let msg="user already exists but inactive.";
						//response.resp(res, 417, msg)
						userObj = underscore.extend(userObj, {userStatus:"otpNotVerified"});
						response.resp(res, 200, userObj)
					
    			} else {

    				userObj = underscore.extend(userObj, {serverTimestamp:currentTS});

	        		let t = await bcrypt.compare(password, userObj.password);
					if(t){
						if(userObj.isBanned == 1){
		    				// res.status(400).send({message:"Sorry! You cannot login."})
							//response.resp(res, 400, {message:"Sorry! You cannot login."})
							
					let msg="Sorry! You cannot login.";
					response.resp(res, 417, msg)

		    			} else {

							if(isEmpty(userObj.image)){
								userObj.image = process.env.IMAGES + 'profile.png';
							} else {
								userObj.image = process.env.IMAGES + userObj.image;
							}
							//console.log('userObj.id------------',userObj.id);
							let channel = await channelHostModel.getChannel(userObj.id);
							//console.log('------channel123456789------------',channel)
							
							if(channel)
							{							
							userObj = underscore.extend(userObj, {channel:channel.channelId});
							}else{
								userObj = underscore.extend(userObj, {channel:''});
							}
							const token = await auth.createToken(userObj.id);
							 //console.log('token-1111------------',token);
							let updateUser = await tokenModel.updateToken(userObj.id, token);
							
							userObj = underscore.extend(userObj, {token:token});
							if(userObj.type == 2)
							{
				let sessionAfetr30Min = await sessionModel.getsessionExistAfter30Min(userObj.id);
				console.log('------sessionAfetr30Min------------',sessionAfetr30Min.length)
							if(sessionAfetr30Min.length > 0)
							{
								userObj = underscore.extend(userObj, {sessionExistIn30Min:"yes"});
							}else{
								userObj = underscore.extend(userObj, {sessionExistIn30Min:"no"});
							}
							}else{
								userObj = underscore.extend(userObj, {sessionExistIn30Min:"no"});
							}
							userObj = underscore.omit(userObj, 'password');
							userObj = underscore.omit(userObj, 'status');
							userObj = underscore.omit(userObj, 'isBanned');
							
							//underscore.extend(userObj, defaultConfig);

							// let settings = await settingModel.getSettings();

							// underscore.extend(userObj, {default: settings});

							
							if( sessionId != '' &&  sessionId > 0 &&  scheduleDate != '' &&  duration != '' &&  duration > 0 )
							{	
								let sessionUserExit = await sessionUserModel.getSessionUser(sessionId,userObj.id,userObj.type);	
								console.log('-------------sessionUserExit11-------------',sessionUserExit.length)
								if(sessionUserExit.length < 1)
								{
							
				let sessionDatares = await sessionModel.getSessionDetailBySessionId(sessionId);



							console.log('--------sessionDatares---------',sessionDatares)

					let sessionStartTime = new Date(sessionDatares.scheduleDate);

					let date = ("0" + sessionStartTime.getDate()).slice(-2);
					let month = ("0" + (sessionStartTime.getMonth() + 1)).slice(-2);
					let year = sessionStartTime.getFullYear();
					let hours = ("0" + sessionStartTime.getHours()).slice(-2);
					let minutes = ("0" + sessionStartTime.getMinutes()).slice(-2);
					let seconds = ("0" + sessionStartTime.getSeconds()).slice(-2);


					let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
					//console.log('---------currentDate-----------',currentDate)
					let sessionEndTime = new Date(sessionDatares.sessionEndDate);
					let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
					let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
					let year1 = sessionEndTime.getFullYear();
					let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
					let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
					let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);


			let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;
			//console.log('---------endDate-----------',endDate)
			let sessionExit = await sessionModel.getsessionExistAtSameTime(userObj.id,currentDate,endDate);

				// 				let sessionStartTime = new Date(scheduleDate);

				// 				let date = ("0" + sessionStartTime.getDate()).slice(-2);
				// 				let month = ("0" + (sessionStartTime.getMonth() + 1)).slice(-2);
				// 				let year = sessionStartTime.getFullYear();
				// 				let hours = ("0" + sessionStartTime.getHours()).slice(-2);
				// 				let minutes = ("0" + sessionStartTime.getMinutes()).slice(-2);
				// 				let seconds = ("0" + sessionStartTime.getSeconds()).slice(-2);
				
					
				// 				let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
							
				// 				let sessionEndTimeinMinutes=sessionStartTime.setMinutes(sessionStartTime.getMinutes() + duration );
								
				// 				 let sessionEndTime = new Date(sessionEndTimeinMinutes);

				// 				 let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
				// 				 let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
				// 				 let year1 = sessionEndTime.getFullYear();
				// 				 let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
				// 				 let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
				// 				 let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);
					 
					 
				// 				 let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;
						
				// let sessionExit = await sessionModel.getsessionExist(userObj.id,currentDate,endDate,userObj.type);

				// 				// console.log('----------sessionExit----------',sessionExit.length)

						if(sessionExit.length < 1){
							// if(sessionExit.length < 1){
								let pm = await sessionModel.isMember(sessionId,userObj.id);
								let pmv=pm.length>0?1:0;

								console.log("PM AND PMV===>",pm.length,pm,pmv);
								 let sessionUserData;
									
									sessionUserData = [[sessionId,userObj.id,2,0,1,pmv]]
					console.log('----------sessionId23333------------------',sessionUserData)
			
								let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
								userObj = underscore.extend(userObj, {'sessionSignup':'yes'});
								}else{
									userObj = underscore.extend(userObj, {'sessionSignup':'no'});
								}
							}else{
								userObj = underscore.extend(userObj, {'sessionSignup':'no'});
							}				
						}
						
							response.resp(res, 200, userObj)
						}
					} else {
						// res.status(400).send({password:"Invalid password"})
						//response.resp(res, 200, {password:"Invalid password"})

						let msg="Invalid password.";
					response.resp(res, 417, msg)

					}
				}
			} else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
			//	response.resp(res, 200, {email:"User doesn\'t exists in system."})

				let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}



	async onDemandSessionData(req, res) {
		try {

		let val=req.body;
		let email = val.email;
		console.log('--------email---------',email)
	let dateTime1 = '';
	let weekend = '';
		if(true === isEmpty(req.body.sessionDate)){
			 dateTime1 = null;


			 var curr = new Date; // get current date
// 			var first = curr.getDate() - curr.getDay() + 2; 
// 			var last = first + 6; 

// 			var firstday = new Date(curr.setDate(first));
// 			var lastday = new Date(curr.setDate(last));

// console.log('------firstday-------lastday-----------',firstday,lastday)

			 let startOfWeek = moment().startOf('week').toDate();
			 console.log('---------startOfWeek-----------',startOfWeek)
			let  endOfWeek   = moment().endOf('week').toDate();
			  console.log('---------endOfWeek-----------',endOfWeek)


			 // let date_ob1= new Date(lastday);

			  let date_ob1= new Date(endOfWeek);

		
			  // dateTime1 = date_ob.getTime();
  
			   let date1 = ("0" + date_ob1.getDate()).slice(-2);
				  let month1 = ("0" + (date_ob1.getMonth() + 1)).slice(-2);
				  let year1 = date_ob1.getFullYear();
				  let hours1 = ("0" + date_ob1.getHours()).slice(-2);
				  let minutes1 = ("0" + date_ob1.getMinutes()).slice(-2);
				  let seconds1 = ("0" + date_ob1.getSeconds()).slice(-2);
  
	  
				  // dateTime1= year+'-'+month+'-'+date;
				   weekend= year1+'-'+month1+'-'+date1;
			console.log('----------weekend------------------',weekend)

		}else{

			let date_ob= new Date(req.body.sessionDate);

		
			// dateTime1 = date_ob.getTime();

			 let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);

	
				// dateTime1= year+'-'+month+'-'+date;
				 dateTime1= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
				 weekend= null;
		}


		//console.log('--------req.body----------',req.body,dateTime1)
	
		let userObj = await userModel.getUserByEmail(email);
		console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
		
			if(userObj.status == 0){

				let msg="user already exists but inactive.";
				response.resp(res, 417, msg)

			} else {
				let channelList = await channelHostModel.getChannelList(userObj.id);

				console.log('-------channelList--------',channelList)

				let newArr1=[];

				for(let i in channelList)
				{
					newArr1.push(channelList[i].channelId);
				}
				//console.log('-------newArr1--------',newArr1)
				//let currentSession = await sessionModel.getNextSession11(userObj.id,userObj.type);

			let currentSession = await sessionModel.getNextOnDemandSessionByChannelId(userObj.id,userObj.type,newArr1,dateTime1,weekend);
				console.log('----currentSession-----------',currentSession)


				// let defaultSession = await sessionModel.getNextDeafaultSessionByChannelId(userObj.id,userObj.type,newArr1);
							
				// console.log('--------------defaultSession-------------------',defaultSession)
				// let currentSession = defaultSession.concat(currentSession1);
				// console.log('--------------currentSession-------------------',currentSession)
			let sessionData = {};
			userObj = underscore.omit(userObj, 'password');
			userObj = underscore.omit(userObj, 'status');
			userObj = underscore.omit(userObj, 'isBanned');	
			if(!isEmpty(currentSession)){
			
				for(let i in currentSession){		
				let sessionHost = await sessionUserModel.getSessionHost(currentSession[i].id);
				let totalSignup = await sessionUserModel.getTotalSignup(currentSession[i].id);
				console.log('----------totalSignup----------------',totalSignup)
				if(sessionHost.length > 0)
				{
					underscore.extend(currentSession[i], {hostId : sessionHost[0].hostId});
					underscore.extend(currentSession[i], {hostFirstName : sessionHost[0].hostFirstName});
					underscore.extend(currentSession[i], {hostLastName : sessionHost[0].hostLastName});
					underscore.extend(currentSession[i], {hostEmail : sessionHost[0].hostEmail});
					underscore.extend(currentSession[i], {hostImage : sessionHost[0].hostImage});
					underscore.extend(currentSession[i], {totalSignUp : totalSignup.length});
				}
				//console.log('-----------sessionHost11111--------',sessionHost)
			}
				
				userObj = underscore.extend(userObj, {sessionData:currentSession});
			
		} else {

			userObj = underscore.extend({ sessionData : []});
		}

		response.resp(res, 200, userObj)
		}
			}else {
		
				let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
			}
				

		}catch(exception) {

			response.resp(res, 500, exception)
	    }

	}


	async host_dashboardData(req, res) {
		try {

		let val=req.body;
		let email = val.email;
		let type= val.type;
		console.log('--------req.body---------',req.body)
	let dateTime1 = '';
	let weekend = '';
		if(true === isEmpty(req.body.sessionDate)){
			 dateTime1 = null;


			 var curr = new Date; // get current date

			
// 			var first = curr.getDate() - curr.getDay() + 2; 
// 			console.log('------curr.getDate()-------curr.getDay()-----------',curr.getDate(),curr.getDay(),first)
// 			var last = first + 6; 

// 			var firstday = new Date(curr.setDate(first));
// 			var lastday = new Date(curr.setDate(last));

// console.log('------firstday-------lastday-----------',firstday,lastday)

			 let startOfWeek = moment().startOf('week').toDate();
			 console.log('---------startOfWeek-----------',startOfWeek)
			let  endOfWeek   = moment().endOf('week').toDate();
			  console.log('---------endOfWeek-----------',endOfWeek)


			  //let date_ob1= new Date(lastday);

			  let date_ob1= new Date(endOfWeek);
		
			  // dateTime1 = date_ob.getTime();

			   let date1 = ("0" + date_ob1.getDate()).slice(-2);
				  let month1 = ("0" + (date_ob1.getMonth() + 1)).slice(-2);
				  let year1 = date_ob1.getFullYear();
				  let hours1 = ("0" + date_ob1.getHours()).slice(-2);
				  let minutes1 = ("0" + date_ob1.getMinutes()).slice(-2);
				  let seconds1 = ("0" + date_ob1.getSeconds()).slice(-2);
 
				  // dateTime1= year+'-'+month+'-'+date;
				   weekend= year1+'-'+month1+'-'+date1;
			console.log('----------weekend------------------',weekend)

		}else{

			let date_ob= new Date(req.body.sessionDate);

		
			// dateTime1 = date_ob.getTime();

			 let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);

	
				// dateTime1= year+'-'+month+'-'+date;
				 dateTime1= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
				 weekend= null;
		}


		//console.log('--------req.body----------',req.body,dateTime1)
	
		let userObj = await userModel.getUserByEmail(email);
		console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
		
			if(userObj.status == 0){

				let msg="user already exists but inactive.";
				response.resp(res, 417, msg)

			} else {
				let channelList = await channelHostModel.getChannelList(userObj.id);

				console.log('-------channelList--------',channelList)

				let newArr1=[];

				for(let i in channelList)
				{
					newArr1.push(channelList[i].channelId);
				}
				//console.log('-------newArr1--------',newArr1)
	
			//let currentSession1 = await sessionModel.getNextSessionByChannelId(userObj.id,userObj.type,newArr1,dateTime1,weekend);
			let currentSession1 = await sessionModel.getNextSessionByChannelId(userObj.id,type,newArr1,dateTime1,weekend);
				console.log('----currentSession1-----------',currentSession1)

				//let defaultSession = await sessionModel.getNextDeafaultSessionByChannelId(userObj.id,userObj.type,newArr1);

				let defaultSession = await sessionModel.getNextDeafaultSessionByChannelId(userObj.id,type,newArr1);
							
				console.log('--------------defaultSession-------------------',defaultSession)
				let currentSession = defaultSession.concat(currentSession1);
				console.log('--------------currentSession.length-------------------',currentSession.length)
			
			let sessionData = {};
			userObj = underscore.omit(userObj, 'password');
			userObj = underscore.omit(userObj, 'status');
			userObj = underscore.omit(userObj, 'isBanned');	
			if(!isEmpty(currentSession)){
			
				for(let i in currentSession){		
				let sessionHost = await sessionUserModel.getSessionHost(currentSession[i].id);
				let totalSignup = await sessionUserModel.getTotalSignup(currentSession[i].id);
				console.log('----------totalSignup----------------',totalSignup)
				if(sessionHost.length > 0)
				{
					underscore.extend(currentSession[i], {hostId : sessionHost[0].hostId});
					underscore.extend(currentSession[i], {hostFirstName : sessionHost[0].hostFirstName});
					underscore.extend(currentSession[i], {hostLastName : sessionHost[0].hostLastName});
					underscore.extend(currentSession[i], {hostEmail : sessionHost[0].hostEmail});
					underscore.extend(currentSession[i], {hostImage : sessionHost[0].hostImage});
					underscore.extend(currentSession[i], {totalSignUp : totalSignup.length});
				}
				//console.log('-----------sessionHost11111--------',sessionHost)
			}
				
				userObj = underscore.extend(userObj, {sessionData:currentSession});
			
		} else {

		let nextSess = await sessionModel.getNextSessionInNextWeek(userObj.id,type,newArr1,dateTime1);

			if(nextSess.length > 0)
			{
			//	underscore.extend(sessionData, {sessionInNextWeek:nextSess[0]});
			userObj = underscore.extend({ sessionData : []});
			userObj = underscore.extend(userObj, {sessionInNextWeek:nextSess[0]});
			}
			else{
				userObj = underscore.extend({ sessionData : []});
				userObj = underscore.extend(userObj, {sessionInNextWeek:null});
			}
			
		}

		response.resp(res, 200, userObj)
		}
			}else {
		
				let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
			}
				

		}catch(exception) {

			response.resp(res, 500, exception)
	    }

	}

	async admin_dashboardData(req, res) {
		try {
		let val=req.body;
		let email = val.email;
		let type= val.type;
		let dateTime1 = '';
		if(true === isEmpty(req.body.sessionDate)){
			 dateTime1 = null;
		}else{

			let date_ob= new Date(req.body.sessionDate);

		
			// dateTime1 = date_ob.getTime();

			 let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);

	
				// dateTime1= year+'-'+month+'-'+date;
				dateTime1= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

		}
		let userObj = await userModel.getUserByEmail(email);
		//console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
		
			if(userObj.status == 0){

				let msg="user already exists but inactive.";
				response.resp(res, 417, msg)

			} else {
			//let currentSession1 = await sessionModel.getNextSession(userObj.id,userObj.type,dateTime1);
			let currentSession1 = await sessionModel.getNextSession(userObj.id,type,dateTime1);
			//let defaultSession = await sessionModel.getNextDeafaultSession(userObj.id,userObj.type);
			let defaultSession = await sessionModel.getNextDeafaultSession(userObj.id,type);
				//console.log('----currentSession-----------',currentSession)

				let currentSession = defaultSession.concat(currentSession1);
				console.log('--------------currentSession-------------------',currentSession)
			let sessionData = {};
			userObj = underscore.omit(userObj, 'password');
			userObj = underscore.omit(userObj, 'status');
			userObj = underscore.omit(userObj, 'isBanned');	
			if(!isEmpty(currentSession)){

				for(let i in currentSession){

				let sessionHost = await sessionUserModel.getSessionHost(currentSession[i].id);
				let totalSignup = await sessionUserModel.getTotalSignup(currentSession[i].id);
				//console.log('----------totalSignup----------------',totalSignup)
				if(sessionHost.length > 0)
				{
					underscore.extend(currentSession[i], {hostId : sessionHost[0].hostId});
					underscore.extend(currentSession[i], {hostFirstName : sessionHost[0].hostFirstName});
					underscore.extend(currentSession[i], {hostLastName : sessionHost[0].hostLastName});
					underscore.extend(currentSession[i], {hostEmail : sessionHost[0].hostEmail});
					underscore.extend(currentSession[i], {hostImage : sessionHost[0].hostImage});
					underscore.extend(currentSession[i], {totalSignUp : totalSignup.length});
				}
				//console.log('-----------sessionHost11111--------',sessionHost)
			}
				
				userObj = underscore.extend(userObj, {sessionData:currentSession});
			
		} else {

			console.log('----------nextSess1111----------------',userObj.id,type,dateTime1)
			let nextSess = await sessionModel.getNextSessionInNextWeekforParticipant(userObj.id,type,dateTime1);
//console.log('----------nextSess----------------',nextSess)
				if(nextSess.length > 0)
				{
			//	underscore.extend(sessionData, {sessionInNextWeek:nextSess[0]});
				userObj = underscore.extend({ sessionData : []});
				userObj = underscore.extend(userObj, {sessionInNextWeek:nextSess[0]});
				}
				else{
					userObj = underscore.extend({ sessionData : []});
					userObj = underscore.extend(userObj, {sessionInNextWeek:null});
				}
		}

		response.resp(res, 200, userObj)
		}
			}else {
				
				let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
			}
				

		}catch(exception) {

			response.resp(res, 500, exception)
	    }

	}


	async host_past_sessiondData(req, res) {
		try {
			console.log('--------req.body---------',req.body)
		let val=req.body;
		let email = val.email;
		let type= val.type;
		let dateTime1 = '';
		if(true === isEmpty(req.body.sessionDate)){
		console.log('yes');
			 dateTime1 = null;
		}else{
			console.log('no');
			let date_ob= new Date(req.body.sessionDate);

		
			// dateTime1 = date_ob.getTime();

			 let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);

	
				 // dateTime1= year+'-'+month+'-'+date;
				 dateTime1= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

		}


		//console.log('--------req.body----------',req.body,dateTime1)

		let userObj = await userModel.getUserByEmail(email);
		//console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
			if(userObj.status == 0){

				let msg="user already exists but inactive.";
				response.resp(res, 417, msg)
			} else {

				let channelList = await channelHostModel.getChannelList(userObj.id);

				//console.log('-------channelList--------',channelList)

				let newArr1=[];

				for(let i in channelList)
				{
					newArr1.push(channelList[i].channelId);
				}
			
			//let currentSession1 = await sessionModel.getPastSessionByChannelId(userObj.id,userObj.type,newArr1,dateTime1);

			let currentSession1 = await sessionModel.getPastSessionByChannelId(userObj.id,type,newArr1,dateTime1);
			
			//let defaultSession = await sessionModel.getPastDeafaultSessionByChannelId(userObj.id,userObj.type,newArr1);

			let defaultSession = await sessionModel.getPastDeafaultSessionByChannelId(userObj.id,type,newArr1);	

					let currentSession = defaultSession.concat(currentSession1);
					//console.log('--------------currentSession-------------------',currentSession)
			let sessionData = {};
			if(!isEmpty(currentSession)){
		
				userObj = underscore.omit(userObj, 'password');
				userObj = underscore.omit(userObj, 'status');
				userObj = underscore.omit(userObj, 'isBanned');


				for(let i in currentSession){

					let sessionHost = await sessionUserModel.getSessionHost(currentSession[i].id);
					let totalSignup = await sessionUserModel.getTotalSignup(currentSession[i].id);
					//console.log('----------totalSignup----------------',totalSignup)
					if(sessionHost.length > 0)
					{
						underscore.extend(currentSession[i], {hostId : sessionHost[0].hostId});
						underscore.extend(currentSession[i], {hostFirstName : sessionHost[0].hostFirstName});
						underscore.extend(currentSession[i], {hostLastName : sessionHost[0].hostLastName});
						underscore.extend(currentSession[i], {hostEmail : sessionHost[0].hostEmail});
						underscore.extend(currentSession[i], {hostImage : sessionHost[0].hostImage});
						underscore.extend(currentSession[i], {totalSignUp : totalSignup.length});
					}
					if(currentSession[i].isCompleted == 2 || currentSession[i].sessionStatus == 2)
					{
						underscore.extend(currentSession[i], {sessionStat : "Canceled"})
					}else if (currentSession[i].isCompleted == 1 || currentSession[i].sessionStatus == 1){
						underscore.extend(currentSession[i], {sessionStat : "Attended"})					
					}else if(currentSession[i].sessionStatus == 0){
						underscore.extend(currentSession[i], {sessionStat : "skipped"})
					}
					//console.log('-----------sessionHost11111--------',sessionHost)
				}
	

				userObj = underscore.extend(userObj, {sessionData:currentSession});
			
		} else {

			userObj = underscore.extend({ sessionData : []});

		}
		response.resp(res, 200, userObj)
		}
			}else {
	

				let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
			}
				
		}catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }

	}

	async admin_past_sessiondData(req, res) {
		try {
		//if(!isEmpty(req.body)){
		let val=req.body;
		let email = val.email;
		let type= val.type;

		let dateTime1 = '';
		if(true === isEmpty(req.body.sessionDate)){
			 dateTime1 = null;
		}else{

			let date_ob= new Date(req.body.sessionDate);

		
			// dateTime1 = date_ob.getTime();

			 let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);

	
				// dateTime1= year+'-'+month+'-'+date;
				dateTime1= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

		}

		let userObj = await userModel.getUserByEmail(email);
		//console.log('-------userObj-------',userObj)
		if(!isEmpty(userObj)){
			if(userObj.status == 0){

				let msg="user already exists but inactive.";
				response.resp(res, 417, msg)
			} else {
			//let currentSession1 = await sessionModel.getPastSession(userObj.id,userObj.type,dateTime1);

			let currentSession1 = await sessionModel.getPastSession(userObj.id,type,dateTime1);

			//let defaultSession = await sessionModel.getPastDeafaultSession(userObj.id,userObj.type);

			let defaultSession = await sessionModel.getPastDeafaultSession(userObj.id,type);
				
			let currentSession = defaultSession.concat(currentSession1);
			//console.log('--------------currentSession-------------------',currentSession)
				//console.log('----currentSession-----------',currentSession)
			let sessionData = {};
			if(!isEmpty(currentSession)){
		
				//console.log('----currentSession11-----------',currentSession)

				userObj = underscore.omit(userObj, 'password');
				userObj = underscore.omit(userObj, 'status');
				userObj = underscore.omit(userObj, 'isBanned');


				for(let i in currentSession){

					let sessionHost = await sessionUserModel.getSessionHost(currentSession[i].id);
					let totalSignup = await sessionUserModel.getTotalSignup(currentSession[i].id);
					//console.log('----------totalSignup----------------',totalSignup)
					if(sessionHost.length > 0)
					{
						underscore.extend(currentSession[i], {hostId : sessionHost[0].hostId});
						underscore.extend(currentSession[i], {hostFirstName : sessionHost[0].hostFirstName});
						underscore.extend(currentSession[i], {hostLastName : sessionHost[0].hostLastName});
						underscore.extend(currentSession[i], {hostEmail : sessionHost[0].hostEmail});
						underscore.extend(currentSession[i], {hostImage : sessionHost[0].hostImage});
						underscore.extend(currentSession[i], {totalSignUp : totalSignup.length});
					}
					//console.log('-----------sessionHost11111--------',sessionHost)

					if(currentSession[i].isCompleted == 2)
					{
						underscore.extend(currentSession[i], {sessionStat : "Canceled"})
					}else{
						if(currentSession[i].sessionStatus == 2)
						{
							underscore.extend(currentSession[i], {sessionStat : "Canceled"})
						}else if(currentSession[i].sessionStatus == 0)
						{
							underscore.extend(currentSession[i], {sessionStat : "skipped"})
						}else{
							underscore.extend(currentSession[i], {sessionStat : "attended"})
						}
					}
				}
	

				userObj = underscore.extend(userObj, {sessionData:currentSession});
			
		} else {

			userObj = underscore.extend({ sessionData : []});


		}
		response.resp(res, 200, userObj)
		}
			}else {


				let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
			}
				
		}catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }

	}
	
	
	async login(req, res) {
	    try {
	    	let email = req.body.email;
	    	let password = req.body.password;
	    	let userObj = await userModel.getUserByEmail(email);
	    	let currentTS = Date.now();

			if(!isEmpty(userObj)){

    			if(userObj.status == 0){
    				// res.status(400).send({message:"user already exists but inactive."})
					//response.resp(res, 400, {message:"user already exists but inactive."})
					
					let msg="user already exists but inactive.";
					response.resp(res, 417, msg)
    			} else {

    				userObj = underscore.extend(userObj, {serverTimestamp:currentTS});

	        		let t = await bcrypt.compare(password, userObj.password);
					if(t){
						if(userObj.isBanned == 1){
		    				// res.status(400).send({message:"Sorry! You cannot login."})
							//response.resp(res, 400, {message:"Sorry! You cannot login."})
							
							let msg="Sorry! You cannot login..";
					response.resp(res, 417, msg)
							
		    			} else {

							if(isEmpty(userObj.image)){
								userObj.image = process.env.IMAGES + 'profile.png';
							} else {
								userObj.image = process.env.IMAGES + userObj.image;
							}

							const token = await auth.createToken(userObj.id);
							 //console.log('token-1111------------',token);
							let updateUser = await tokenModel.updateToken(userObj.id, token);
							
							userObj = underscore.extend(userObj, {token:token});

							//let onBoarding = await userModel.getOnBoarding(email);

							let onBoarding = await userModel.getOnBoarding(email);
							//console.log('--------onBoarding----------',onBoarding)

							userObj = underscore.extend(userObj, {onBoarding:onBoarding.ifExist});

							let newAgoraConfig = await sessionModel.getAgoraConfig();

							//console.log('------newAgoraConfig--------',newAgoraConfig.appId)

							userObj = underscore.extend(userObj, {appId:newAgoraConfig.appId});

							let settings = await settingModel.getSettings();

			let currentSession = await sessionModel.getUpcommingSession(userObj.id,userObj.type);
				console.log('----------currentSession11111111111---------',currentSession)
							let sessionData = {};
							if(!isEmpty(currentSession)){
																
								currentSession = currentSession[0];

								let sessionHost1 = await sessionUserModel.getSessionHost(currentSession.id);
								if(sessionHost1.length > 0)
								{
									underscore.extend(currentSession, {hostId : sessionHost1[0].hostId});
									underscore.extend(currentSession, {hostFirstName : sessionHost1[0].hostFirstName});
									underscore.extend(currentSession, {hostLastName : sessionHost1[0].hostLastName});
									underscore.extend(currentSession, {hostEmail : sessionHost1[0].hostEmail});
									underscore.extend(currentSession, {hostImage : sessionHost1[0].hostImage});
								}
								//console.log('-----------sessionHost11111--------',sessionHost1)

							 	let sessionEndTime = new Date(currentSession.scheduleDate);

							let sessionEndTime1=sessionEndTime.setMinutes(sessionEndTime.getMinutes() + currentSession.duration );
							// console.log('-------sessionEndTime1------------',sessionEndTime1)
							 let currentTime= new Date().getTime();
							// console.log('-------currentTime------------',currentTime)
										

							let substractedTime= sessionEndTime1-currentTime;
							//console.log('-------substractedTime------------',substractedTime)

							let minte= Math.floor((substractedTime / 60000) % 60);
						 
							let hours = Math.floor((substractedTime / 3600000));
							 let hrs=hours*60;
							 let totalminute=hrs+minte;
							 let nextSession=[];

							 	if (currentTime > new Date(currentSession.scheduleDate).getTime()) {
							 		if(totalminute < settings.streamJoiningDefaultTime){
									//let time_duration=totalminute+settings.streamJoiningDefaultTime;
									let time_duration=settings.streamJoiningDefaultTime;
									let prevSessionEndTime=totalminute;								
									//console.log('-----time_duration-----------',time_duration)
							let nextSession1 = await sessionModel.getnextSessionAfterthirtyMinute(userObj.id,time_duration,prevSessionEndTime,userObj.type);

									nextSession=nextSession1;
									}
							 	}

								if(nextSession.length > 0)
								{
								userObj = underscore.extend(userObj, {totalSession:2});
								nextSession = nextSession[0];

								let sessionHost2 = await sessionUserModel.getSessionHost(nextSession.id);
								if(sessionHost2.length > 0)
								{
									underscore.extend(nextSession, {hostId : sessionHost2[0].hostId});
									underscore.extend(nextSession, {hostFirstName : sessionHost2[0].hostFirstName});
									underscore.extend(nextSession, {hostLastName : sessionHost2[0].hostLastName});
									underscore.extend(nextSession, {hostEmail : sessionHost2[0].hostEmail});
									underscore.extend(nextSession, {hostImage : sessionHost2[0].hostImage});
								}
								//console.log('-----------sessionHost11111--------',sessionHost2)

								let sessionstartTime = new Date(nextSession.scheduleDate).getTime();
								let currentNewTime= new Date().getTime();
								let substractedNewTime= sessionstartTime-currentTime;
								let minte1= Math.floor((substractedNewTime / 60000) % 60);
						 
								let hours1 = Math.floor((substractedNewTime / 3600000));
								 let hrs1=hours1*60;
								 let totalminute1=hrs1+minte1;
								 //console.log('-------totalminute1------------',totalminute1)

								 userObj = underscore.extend(userObj, {nextSessionInMinutes:totalminute1});

								let nestedData = [];
								nestedData[0]=currentSession;
								nestedData[1]=nextSession;
								underscore.extend(userObj, { sessionData : nestedData });	
								//underscore.extend(userObj, { sessionData : currentSession });
								}else{
									//console.log('--------nextSession.length333333------------',nextSession.length)
									userObj = underscore.extend(userObj, {totalSession:1});
								//currentSession = currentSession[0];
								//console.log('--------currentSession11-------------',currentSession.id)
								let sessiondetail = await sessionModel.individualSessDetail(currentSession.id,userObj.id);
								sessiondetail = sessiondetail[0];
								let sessionHost = await sessionUserModel.getSessionHost(sessiondetail.id);
								if(sessionHost.length > 0)
								{
									underscore.extend(sessiondetail, {hostId : sessionHost[0].hostId});
									underscore.extend(sessiondetail, {hostFirstName : sessionHost[0].hostFirstName});
									underscore.extend(sessiondetail, {hostLastName : sessionHost[0].hostLastName});
									underscore.extend(sessiondetail, {hostEmail : sessionHost[0].hostEmail});
									underscore.extend(sessiondetail, {hostImage : sessionHost[0].hostImage});
								}
								//console.log('-----------sessionHost11111--------',sessionHost)	
								if(sessiondetail.logo && !isEmpty(sessiondetail.logo)){
									sessiondetail.logo = process.env.LOGOS + sessiondetail.logo;
								} else {
									sessiondetail.logo = process.env.IMAGES + 'login-logo.png';
								}

								

								let scriptInfo = {scriptTitle:'', scriptType:''};
								if(sessiondetail.code == 100) {
									scriptInfo = {scriptTitle:'Wine Script', scriptType:'wine'};
								} else if(sessiondetail.code == 101) {
									scriptInfo = {scriptTitle:'Fitness Script', scriptType:'fitness'};
								} else if(sessiondetail.code == 102) {
									scriptInfo = {scriptTitle:'Cooking Script', scriptType:'cooking'};
								}
								underscore.extend(sessiondetail, scriptInfo);
				
								underscore.extend(userObj, {userType : sessiondetail.type});
								
								// get timing remaining
								let str = utils.dateTimeDiff(sessiondetail.scheduleDate);
								underscore.extend(sessiondetail, {messgae:str});

								let agoraConfig = await sessionModel.getSessionAgoraConfig(sessiondetail.id);

								if(!isEmpty(agoraConfig)){
									for(let i in agoraConfig){
										if(agoraConfig[i].type == 1){
											underscore.extend(sessiondetail, {appId: agoraConfig[i].appId});
											// generate streaming token
											let streamToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, sessiondetail.channelId, sessiondetail.userId);
											// dummy token for bandwidth check
											let channelUid = 9999999999 + '' + sessiondetail.channelId + '' + userObj.id;
											
											let streamDummyToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, channelUid, sessiondetail.userId);

											underscore.extend(sessiondetail, {streamToken : streamToken});
											underscore.extend(sessiondetail, {streamDummyToken : streamDummyToken});
											// sessiondetail = underscore.omit(sessiondetail, 'appCertificate');
										} else if(agoraConfig[i].type == 2){
											underscore.extend(sessiondetail, {rtmAppId: agoraConfig[i].appId});
										}
									}
								}
								
								let scriptDetail = await sessionScriptModel.getProductDetail(sessiondetail.id, sessiondetail.hostId, sessiondetail.code);

								if(!isEmpty(scriptDetail)){
								underscore.extend(sessiondetail, {scriptDetail : scriptDetail});
								}
								
								if(isEmpty(sessiondetail.hostImage)){
									sessiondetail.hostImage = process.env.IMAGES + 'profile.png';
								} else {
									sessiondetail.hostImage = process.env.IMAGES + sessiondetail.hostImage;
								}


								let shoppingList = await SessionShoppingListModel.getSessionshoppingDTA(sessiondetail.id)
								//console.log('-----shoppingList--------',shoppingList)	
								if(!isEmpty(shoppingList)){			
								sessiondetail = underscore.extend(sessiondetail, {shoppingList : shoppingList});
								}
								let equipmentList = await SessionEquipmentMappingModel.getSessionEquipmentDTA(sessiondetail.id)
				
								console.log('-----equipmentList--------',equipmentList)	
								if(!isEmpty(equipmentList)){	
									sessiondetail = underscore.extend(sessiondetail, {equipmentList : equipmentList});
								}

								underscore.extend(userObj, { sessionData : sessiondetail});
								}
							} else {

								underscore.extend(userObj, { message : "There are no sessions available."});
								// underscore.extend(userObj, { sessionData : []});
							}

							userObj = underscore.omit(userObj, 'password');
							userObj = underscore.omit(userObj, 'status');
							userObj = underscore.omit(userObj, 'isBanned');
							
							underscore.extend(userObj, defaultConfig);

							//let settings = await settingModel.getSettings();

							underscore.extend(userObj, {default: settings});
							console.log('Before response============', userObj);
							response.resp(res, 200, userObj)
						}
					} else {
			
						let msg="Incorrect Password, please correct your password and try again";
						response.resp(res, 417, msg)
					}
				}
			} else {
			
				let msg="We could not find the email address in Virdio, please check your email address and correct it or sign up at Virdio.com";
						response.resp(res, 417, msg)
			}
				
	    } catch(exception) {
	    	console.log('Func - login exception====', exception)
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async tempRegister(req, res) {
	    try {
			//let participent=req.body.participentDetail;
			let participent=req.body;			
	    	let email = participent.email;
			let channelId = participent.channelId ? participent.channelId : 0;
			let channelAdmin = participent.channelAdmin ? participent.channelAdmin : 0;
			let sessionId = participent.sessionId ? participent.sessionId : 0;
			let userStatus = participent.userStatus;
			let userType = participent.userType;
			
			let userObj = await userModel.getExistsUserByEmail(email);
			if(userObj.id != channelAdmin)
			{
			//console.log('----------participent111---------',participent)
			let channelExist = await channelHostModel.getChannelExist(channelId,userObj.id);

			console.log('----------channelExist---------',channelExist)

			if(channelExist.length > 0)
			{
				let msg="Invited User is already a host to this channel";
				response.resp(res, 417, msg)
			}else
			{
			let channelDetail = await ChannelsModel.getChannelName(channelId);
			//console.log('------------channelDetail--------',channelDetail)
			if(isEmpty(userObj)){				
				
				let userData = {
					firstName	 : participent.firstName,
					lastName : participent.lastName,
					email : participent.email,
					userType : participent.userType
				};
			//	console.log('--------userData-------------',userData)
				let insertedId = await tempusersModel.addTempUser(userData);

				if(insertedId)
				{	
					let html='';								
					if(userType == 1)
					{
											
						let encodeEmail=channelId+'#'+email+'#'+channelAdmin;
						let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
						console.log('-----------encoded_email-----------',encoded_email)

					// let html1 ='<p>Click <a href="'+process.env.DOMAIN_URL_For_inviteUser+"/"+ encoded_email+'">here</a> to join virdio as Host</p>';

					let html1 ='<body style="font-family: Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; margin:auto; padding-top: 30px; padding-bottom: 30px; box-sizing: border-box; background-color: #282828;"><div style="padding: 0px 40px;"> <div style="padding-bottom: 30px; margin-bottom: 40px; border-bottom: 1px solid #444444; text-align: center;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">'+participent.firstName+' has invited you to join '+channelDetail.name+' as a Host.</p><p style="font-size: 22px; text-align: center; color: white;">Click the button below to Sign up</p><p style="padding-top: 30px; text-align: center; color: white;"><a href="'+process.env.DOMAIN_URL_For_inviteUser+"/"+ encoded_email+'" style=" padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 18px; text-decoration: none !important;">Sign up</a></p><p style="margin-bottom: 10px !important; font-size: 25px; text-align: center; color: white;">OR</p><p style="margin-top: 0px; font-size: 22px; text-align: center; color: white;">Copy the below URL and open it in to your browser</p></div></div><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="" style="color: white; text-decoration: none;">'+process.env.DOMAIN_URL_For_inviteUser+"/"+ encoded_email+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a> <a href="#"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';

					html=html1;
					}else{
						let encodeEmail=sessionId+'#'+email;
						let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
						console.log('-----------encoded_email-----------',encoded_email)		
					let html2 ='<p>Click <a href="'+process.env.DOMAIN_URL_For_inviteParticipant+"/"+ encoded_email+'">here</a> to join virdio as Participant</p>';
					html=html2;
					}
					//msg += ' email for OTP';
					
					console.log('-------html--------',html)
	
					let to=email;
					let subject='Invitation From Virdio! Lets join us as a host';
					let text='Please Check ur Mail';

					let sendmail = await SendMail.emailInput(to,subject,html);

					let msg = 'Email has been sent to given email id';
					response.resp(res, 200, {message : msg+". Please verify account."})
				}
				
				//response.resp(res, 200, {tempUserid:insertedId})

			} else {
				let html='';
				if(userType == 1)
				{
					let encodeEmail=channelId+'#'+email+'#'+channelAdmin;
					let encoded_email = await utils.encodedDecodedString(encodeEmail,0);
					console.log('-----------encoded_email-----------',encoded_email)
				// let html1='<p>Click <a href="'+process.env.DOMAIN_URL_For_inviteUser+"/"+ encoded_email+'">here</a> to Join Virdio as host</p>';

				let html1 ='<body style="display: flex; justify-content: center;align-items: center; font-family: Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; margin:auto; padding-top: 30px; padding-bottom: 30px; box-sizing: border-box; background-color: #282828;"><div style="padding: 0px 40px;"> <div style="padding-bottom: 30px; margin-bottom: 40px; border-bottom: 1px solid #444444; text-align: center;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">'+participent.firstName+' has invited you to join '+channelDetail.name+' as a Host.</p><p style="font-size: 22px; text-align: center; color: white;">Click the button below to Sign up</p><p style="padding-top: 30px; text-align: center; color: white;"><a href="'+process.env.DOMAIN_URL_For_inviteUser+"/"+ encoded_email+'" style=" padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 20px; text-decoration: none !important;">Sign up</a></p><p style="margin-bottom: 10px !important; font-size: 22px; text-align: center; color: white;">OR</p><p style="margin-top: 0px; font-size: 22px; text-align: center; color: white;">Copy the below URL and open it in to your browser</p></div></div><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="" style="color: white; text-decoration: none;">'+process.env.DOMAIN_URL_For_inviteUser+"/"+ encoded_email+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a> <a href="#"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';

				html=html1;
				}else{
					let encodeEmail=sessionId+'#'+email;
					let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
					console.log('-----------encoded_email-----------',encoded_email)		
				let html2='<p>Click <a href="'+process.env.DOMAIN_URL_For_inviteParticipant+"/"+ encoded_email+'">here</a> to join virdio as Participant</p>';
				html=html2;
				}
				//msg += ' email for OTP';
				
				//console.log('-------html--------',html)

				let to=email;
				let subject='Invitation From Virdio! Lets join us as a host';
				let text='Please Check ur Mail';

				let sendmail = await SendMail.emailInput(to,subject,html);

				let msg = 'Email has been sent to given email id';
				response.resp(res, 200, {message : msg+". Please verify account."})

				//response.resp(res, 200, {tempUserid:''})
				
			}
		}

		}else{
			let msg="You cannot send invitation yourself";
			response.resp(res, 417, msg)
		}
				
	    } catch(exception) {

			response.resp(res, 500, exception)
	    }
	}

	async verifyEmail(req, res) {
		try {		
			console.log('-------lalit111111111------------',req.body)

			let decoded_emailid = await utils.encodedDecodedString(req.body.emailId,1);

			console.log('-------llltttttt------------',decoded_emailid)

			 let decodedData = decoded_emailid.split("#");

			 console.log('-------sessdta------------',decodedData)

			 let channelId= decodedData[0];
			 let emailId= decodedData[1];
			// let emailId= "deepa@test.com";
			 let channelAdmin=decodedData[2];

			 console.log('-------sessionId------------',emailId,channelId)

			let userObj = await userModel.getExistsUserByEmail(emailId);
			let tempUserObj= '';
			if(isEmpty(userObj)){
			 let tempUser = await tempusersModel.getExistsUserByEmail(emailId);
			 tempUserObj=tempUser;
			 underscore.extend(tempUserObj, {existingUser: "No"});

			 tempUserObj = underscore.omit(tempUserObj, 'createdAt');
			 tempUserObj = underscore.omit(tempUserObj, 'status');
			}else{

				let channelHostData;			
				   channelHostData = [[userObj.id,channelId,channelAdmin]]
				   console.log('----------channelHostData------------------',channelHostData)

				   console.log('----------userObj.id,channelId------------------',userObj.id,channelId)

				   let hostDta = await channelHostModel.getChannelHost(userObj.id);

				   console.log('----------hostDta------------------',hostDta.length)

				   if(hostDta.length < 1)
				   {
					let sessionId=process.env.SESSIONID;
					let user_id = userObj.id;
					axios      
					.get(process.env.APP_URL1+"/api/v1/session/"+sessionId+"/individualsessiondetailForAdmin")          
					.then(res => {
					 // console.log('---------Interestactivity111111111--------------',res.data.responseData.sessionData);
			  
						let newDta=res.data.responseData.sessionData;

					 
					  axios.post(process.env.APP_URL2+"/api/v1/session/createDefaultSession", {newDta,user_id,channelId})
		
					  .then(res => {
								
				
						//console.log('=============lallittiwari12345===================>',res.data);
					
					  }).catch(err=>{
						
						//console.log('=============err11111===================>',err);
					  })
						 
					})
					.catch(err =>{
						console.log('----------there is problem------------');
			  
					});
				   }

			   		let channelUserRes = await channelHostModel.addChannelHost(channelHostData);
			  		console.log('----------channelUserRes------------------',channelUserRes)
			 		tempUserObj=userObj;
					   underscore.extend(tempUserObj, {existingUser: "Yes"});

					   tempUserObj = underscore.omit(tempUserObj, 'password');
					   tempUserObj = underscore.omit(tempUserObj, 'status');
					   
			}

			 underscore.extend(tempUserObj, {channelId: channelId});
			 underscore.extend(tempUserObj, {channelAdmin: channelAdmin});
			 underscore.extend(tempUserObj, {isInviteUser: 1});
			console.log('------sessionDta1111---------',tempUserObj)

			response.resp(res, 200, {tempUserObj})
			} catch(exception) {
			response.resp(res, 500, exception);
		}
	}

	async verifyParticipantEmail(req, res) {
		try {
		
			console.log('-------lalit111111111------------',req.body)

			let decoded_emailid = await utils.encodedDecodedString(req.body.emailId,1);

			//console.log('-------llltttttt------------',decoded_emailid)

			 let decodedData = decoded_emailid.split("#");

			// console.log('-------sessdta------------',decodedData)

			 let sessionId= decodedData[0];
			 let emailId= decodedData[1];
			 //let emailId= "deepa@test.com";
		
			 //console.log('-------sessionId------------',emailId,sessionId)

			let userObj = await userModel.getExistsUserByEmail(emailId);
			let tempUserObj= '';
			if(isEmpty(userObj)){
			 let tempUser = await tempusersModel.getExistsUserByEmail(emailId);
			 tempUserObj=tempUser;
			 underscore.extend(tempUserObj, {existingUser: "No"});

			 tempUserObj = underscore.omit(tempUserObj, 'createdAt');
			 tempUserObj = underscore.omit(tempUserObj, 'status');
			}else{
				let pm = await sessionModel.isMember(sessionId,userObj.id);
				let pmv=pm.length>0?1:0;

				let sessionUserData;
							
					sessionUserData = [[sessionId,userObj.id,2,0,1,pmv]]
					console.log('----------sessionId23333------------------',sessionUserData)
					let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
			 		tempUserObj=userObj;
					   underscore.extend(tempUserObj, {existingUser: "Yes"});

					   tempUserObj = underscore.omit(tempUserObj, 'password');
					   tempUserObj = underscore.omit(tempUserObj, 'status');
					   
			}

			 underscore.extend(tempUserObj, {sessionId: sessionId});
				
			console.log('------sessionDta1111---------',tempUserObj)

			response.resp(res, 200, {tempUserObj})
			} catch(exception) {
			response.resp(res, 500, exception);
		}
	}

	async register(req, res) {
	    try {
			//let participent=req.body.participentDetail;
			let participent=req.body;
	    	let email = participent.email;
			console.log('----------participent1111111---------',participent)
	    	let userObj = await userModel.getExistsNewUserByEmail(email);
	    	
			if(isEmpty(userObj)){

				let password = await bcrypt.hash(participent.password, saltRounds);

				let mobileNo='';
				
					if(participent.type == 1)
					{
						//mobileNo=participent.phone.trim();
						mobileNo=participent.phone ? participent.phone.trim() : 0;
					}else{
						mobileNo=participent.phone ? participent.phone.trim() : 0;
					}

					let fname=participent.firstName.trim();
					let lname=participent.lastName.trim();
					let emailId=participent.email.trim();

					let sessionId=participent.sessionId ? participent.sessionId : 0;
					let channelId=participent.channelId ? participent.channelId : 0;
					let channelAdmin=participent.channelAdmin ? participent.channelAdmin : 0;
					
				let userData = {
					name:fname+" "+lname,
					firstName : fname,
					lastName : lname,
					email : emailId,
					type : participent.type,
					password : password,
					// address1 : participent.address1,
					// address2 : participent.address2,
					address1 :null,
					address2 :null,
					// city : participent.city,
					// state : participent.state,
					// zip : participent.zip,
					city :null,
					state :null,
					zip :null,
					image : participent.image
					//phone : mobileNo
				};
				console.log('--------userData-------------',userData)
				let insertedId = await userModel.add(userData);
				console.log('--------insertedId-------------',insertedId)
				if(insertedId > 0){

					if( sessionId != '' &&  sessionId > 0 )
					{
						let pm = await sessionModel.isMember(sessionId,insertedId);
						let pmv=pm.length>0?1:0;			 
						 let sessionUserData;
							
							sessionUserData = [[sessionId,insertedId,2,0,1,pmv]]
						console.log('----------sessionId23333------------------',sessionUserData)
	
			let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
									
					}

					if( channelId != '' &&  channelId > 0 &&  channelAdmin != '' &&  channelAdmin > 0 )
					{
									 
						let channelHostData;			
						channelHostData = [[insertedId,channelId,channelAdmin]]
					//console.log('----------channelHostData------------------',channelHostData)
						let channelUserRes = await channelHostModel.addChannelHost(channelHostData);
						//console.log('----------channelUserRes------------------',channelUserRes)

						let sessionId=process.env.SESSIONID;
						let user_id=insertedId;
						axios      
						.get(process.env.APP_URL1+"/api/v1/session/"+sessionId+"/individualsessiondetailForAdmin")          
						.then(res => {
						 // console.log('---------Interestactivity111111111--------------',res.data.responseData.sessionData);
				  
							let newDta=res.data.responseData.sessionData;
						 
						  axios.post(process.env.APP_URL2+"/api/v1/session/createDefaultSession", {newDta,user_id,channelId})
			
						  .then(res => {
									
					
							//console.log('=============lallittiwari12345===================>',res.data);
						
						  }).catch(err=>{
							
							//console.log('=============err11111===================>',err);
						  })
							 
						})
						.catch(err =>{
							console.log('----------there is problem------------');
				  
						});



			let userObj1 = await userModel.getUserdetailnewById(insertedId);

			if(!isEmpty(userObj1)){

			let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 35px 20px 35px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj1.firstName+', thank you for signing up to host sessions on Virdio. A few quick tips on getting started on Virdio:</p><ul style="font-size: 22px; color: white; padding-left: 15px;"> <li style="margin: 15px;">On your dashboard on Virdio.com, we have placed an initial session for you use so that you can get familiar with what goes into creating a session.</li><li style="margin: 15px;">When you are ready to get familiar with hosting a session, click on the Join button with this session to start your tutorial. The Virdio tutorial will familiarize you with all the controls used during your session.</li><li style="margin: 15px;">Once you have gone through the tutorial, you can create your own sessions and begin to host them with anyone.</li><li style="margin: 15px;">Finally, here is a <a href="'+process.env.DOCS_PATH+'/docs/help/Host_Guide.pdf" class="mx-2">link</a> to a guide to help you through the process.</li></ul> <p style="font-size: 22px; color: white; margin-bottom: 5px; text-align: center;">Best of luck</p><p style="font-size: 22px; color: white; margin-top: 0px; text-align: center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
			//console.log('-------html--------',html)

			let to=userObj1.email;
			let subject='Welcome to Virdio and a few important tips on getting started!';
			let text='Please Check ur Mail';

			let sendmail = await SendMail.emailInput(to,subject,html);
			
			}

									
		}
					
					let msg = 'Your account created successfully, Please check';
					let encodedstring=utils.encodedString(4);
					let emailUpdate = await otpModel.add(insertedId, encodedstring, 0);
					//console.log('------emailUpdate-------',emailUpdate)
					if(emailUpdate > 0){
						//msg += ' email for verification link';
						msg += ' email for OTP';
						// let html='<p>Hi '+participent.firstName+',  please enter the following code ['+encodedstring+'] on the verification screen.</p>';

						let html='<body style="font-family:Arial, sans-serif;"><div style="box-shadow: 0px 0px 7px 2px #1c1c1c; background-color: #282828; max-width: 600px; padding-top: 30px; margin:auto; padding-bottom: 30px; box-sizing: border-box;"><div style="padding: 0px 40px; font-family:Arial, sans-serif;"> <div style="text-align: center; border-bottom: 1px solid #444444; padding-bottom: 20px; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white; font-family:Avenir-Medium;">Hi '+participent.firstName+', please enter the following code</p><p style="margin: 20px 0px; text-align: center;"><span style=" padding: 13px 30px; background-color: #bd00ff; color: white !important; font-size: 32px; text-decoration: none !important; border-radius: 10px; font-weight: bold;">'+encodedstring+'</span></p><p style="margin-bottom: 100px; font-size: 22px; text-align: center; color: white;">on the verification screen.</p><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';

					
						//console.log('-------html--------',html)
		
						let to=participent.email;
						let subject='Your Virdio verification code!';
						let text='Please Check ur Mail';
		
						let sendmail = await SendMail.emailInput(to,subject,html);

					}

					// if(participent.phone != ''){
					// 	//let otpUpdate = await otpModel.add(insertedId, utils.generateOtp(4), 1);
					// 	let otpUpdate = await otpModel.add(insertedId, encodedstring, 1);
					// 	if(otpUpdate){
					// 		msg += ' or OTP sent';
					// 	}
					// } 
					let channel='';

					if(channelId != '' &&  channelId > 0 &&  channelAdmin != '' &&  channelAdmin > 0 )
					{							
						channel=channelId;
					}else{
						channel='';
					}
					//response.resp(res, 200, {message : msg+". Please verify account."})
					response.resp(res, 200, {'channelId':channel})
				
				} else {
					
					//response.resp(res, 400, {message:"Something went wrong."})

					response.resp(res, 417, insertedId)
				}
			} else {
				if(userObj.status == 0){

					//response.resp(res, 200, {message:"Email already exists but inactive."})

					let msg="Email already exists but inactive";
					response.resp(res, 417, msg)
				} else {

					//response.resp(res, 200, {message:"user already exists."})

					let msg="user already exists";
					response.resp(res, 417, msg)
				}
			}
				
	    } catch(exception) {

			response.resp(res, 500, exception)
	    }
	}

	async resendOTP(req, res) {
		try {

			let dta=req.body;
			console.log('------dta---------',dta)
			let email = dta.email != undefined ? dta.email : '';
			let phone = dta.phone != undefined ? dta.phone : '';

			let userObj = await userModel.getExistsNewUserByEmail(email);
			if(!isEmpty(userObj)){
			let msg = 'Your account created successfully, Please check';
			let encodedstring=utils.encodedString(4);
			let emailUpdate = await otpModel.updateNewOtp(userObj.id, encodedstring, 0);			
			console.log('------emailUpdate-------',emailUpdate)
			if(emailUpdate.affectedRows > 0){
				console.log('------emailUpdate111-------',emailUpdate)
				//msg += ' email for verification link';
				msg += ' email for OTP';
				// let html='<p>Hi '+userObj.firstName+',  please enter the following code ['+encodedstring+'] on the verification screen.</p>';

				let html='<body style="font-family:Arial, sans-serif;"><div style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; background-color: #282828; margin: auto; padding-top: 30px; padding-bottom: 30px; box-sizing: border-box;"><div style="padding: 0px 40px; font-family:Arial, sans-serif;"> <div style="text-align: center; border-bottom: 1px solid #444444; padding-bottom: 20px; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white; font-family:Avenir-Medium;">Hi '+userObj.firstName+', please enter the following code</p><p style="margin: 20px 0px; text-align: center;"><span style=" padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 25px; text-decoration: none !important; border-radius: 10px; font-weight: bold;">'+encodedstring+'</span></p><p style="margin-bottom: 100px; font-size: 22px; text-align: center; color: white;">on the verification screen.</p><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="width: 40px; margin: 3px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="width: 40px; margin: 3px;"/></a><a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="width: 40px; margin: 3px;"/></a> </div></div></body>';

				//console.log('-------html--------',html)

				let to=email;
				let subject='Your Virdio verification code!';
				let text='Please Check ur Mail';

				let sendmail = await SendMail.emailInput(to,subject,html);

			}

			response.resp(res, 200, {message : msg+". Please verify account."})


			//let msges=msg+". Please verify account.";
			//response.resp(res, 417, msges)
		}else{

			//response.resp(res, 400, {message : "User doesn\'t exists in system."})

			let msg="User doesn\'t exists in system.";
				response.resp(res, 417, msg)
		}
				
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}

	async createClientToken(req, res) {
		try {
			console.log(req.body)
			let sessionObj = await sessionModel.findSessionDetail(req.body.sessionId, req.body.userId);

			if(true !== underscore.isEmpty(sessionObj)){
				let token = clientToken.createToken(sessionObj.appId, sessionObj.appCertificate, sessionObj.channelId, sessionObj.userId);
				sessionObj = underscore.extend(sessionObj, {token : token})
				sessionObj = underscore.omit(sessionObj, 'appCertificate');
			}

			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}
	/**
	 * verify otp
	 * @param  {obj} req 
	 * @param  {obj} res 
	 * @return {json} 
	 */
	async verifyOtp(req, res){
		try {
			let dta=req.body;
			console.log('------dta---------',dta)
			let email = dta.email != undefined ? dta.email : '';
			let phone = dta.phone != undefined ? dta.phone : '';

		//	let userObj = await userModel.getExistsUserByEmailOrMobile(email, phone);
			let userObj = await userModel.getExistsNewUserByEmail(email);
			
			console.log('------userObj1111111---------',userObj)

			if(!isEmpty(userObj)){

				let updaterevOtp = await otpModel.updaterevOtp(dta.code, userObj.id);

				console.log('------userObj---------',userObj)
				//let verifyChannel = phone != '' ? 1 : 0;

				let verifyChannel = email != '' ? 0 : 1;

				let otpObj = await otpModel.verify(dta.code, userObj.id, verifyChannel);

				if(!isEmpty(otpObj)){

					console.log('otpObj.status = ', otpObj.status);
					if(otpObj.status == 0){

						let updateOtp = await otpModel.updateOtp(dta.code, userObj.id);

						console.log('---------updateOtp--------',updateOtp)
						
						if(updateOtp){

							let token = await auth.createToken(userObj.id);
							 console.log('token-1111------------',token);
							//let updateUser = await tokenModel.updateToken(userObj.id, token);

							// console.log('token-1111------------',token);
									
							let updateUser = await tokenModel.getId(userObj.id);
				
							console.log('updateUser------------',updateUser.length);
							let resUser='';
							if(updateUser.length > 0)
							{
								let resUser1 = await tokenModel.updateTokenId(userObj.id,token);
								resUser=resUser1;	
				
							}else{
								let resUser1111 = await tokenModel.insertTokenId(userObj.id,token);
								resUser=resUser1111;
							}
							
							userObj = underscore.extend(userObj, {token:token});

							userObj = underscore.omit(userObj, 'password');
							userObj = underscore.omit(userObj, 'status');
							//userObj = underscore.omit(userObj, 'isBanned');

							//response.resp(res, 200, {message:"Otp Verified"})

							// let onBoarding = await userModel.getOnBoarding(email);
							// console.log('--------onBoarding----------',onBoarding)

							let FirstSignup = await userModel.getFirstSignup(email);
							console.log('--------FirstSignup----------',FirstSignup)
							//userObj = underscore.extend(userObj, {onBoarding:onBoarding.ifExist});
							//if(userObj.type == 2 && onBoarding.ifExist > 0)
							if(userObj.type == 2 && FirstSignup.isFirstSignup < 1)
							{

								let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 35px 20px 35px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px; font-family:Arial, sans-serif;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj.firstName+', welcome to Virdio. Some important information:</p><ul style="font-size: 22px; color: white; padding-left: 15px;"> <li style="margin: 15px;"> Go to Virdio.com to join your sessions</li><li style="margin: 15px;">Quick link to some tips <a href="'+process.env.DOCS_PATH+'/docs/help/Participant_Guide.pdf" class="mx-2">link</a></li></ul> <p style="font-size: 22px; color: white; margin-bottom: 5px; text-align: center;">Best of luck</p><p style="font-size: 22px; color: white; margin-top: 0px; text-align: center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
							//console.log('-------html--------',html)

							let toe=email;
							let subject1='Welcome to Virdio and a few important tips on getting started!';
							let text1='Please Check ur Mail';

							let sendmail1 = await SendMail.emailInput(toe,subject1,html1);




							
							let encodeEmail=email+'#'+userObj.firstName;
							let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
							console.log('-----------encoded_email-----------',encoded_email)
					

							let iosLink ="https://apps.apple.com/us/app/virdio/id1489704718";

							let androidLink ="https://play.google.com/store/apps/details?id=mvvm.f4wzy.com.virdioApp";
							
							let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 30px 20px 30px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px; font-family:Arial, sans-serif;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj.firstName+', download the Virdio Mobile App to use as a Remote Control to manage your desktop/laptop or use it to stream your session.</p></div><div style="text-align: center; margin-top: 50px;"><p style="font-size: 20px; display: inline-block; padding:10px 25px;background-color: #b80df7; text-align: center; "><a href="'+iosLink+'" style="text-decoration: none; color: white;">Get Virdio iOS App</a></p></div><div style="text-align: center; margin-top: 35px;"><p style="font-size: 20px; display: inline-block; padding:10px 25px; background-color: #b80df7; text-align: center; "><a href="'+androidLink+'" style="text-decoration: none; color: white;">Get Virdio Android App</a></p></div><div class="remote" style="background-color:#343434; margin-top: 150px; padding:10px; margin-bottom: 60px; display: flex; position: relative;"> <div style="width: 40%; height: 100%"> <img src="'+process.env.IMAGE_PATH+'/images/remote.png" style="width: 35%; position: absolute; bottom: 0px; left: -10px;"/> </div><p style="font-size: 22px; color: white; width: 60%;"> Use your Virdio Remote App to manage your session</p></div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';

							// let html='<body style="display: flex; justify-content: center;align-items: center; font-family: Arial, sans-serif;"><div class="email-box" style="padding: 20px 40px 20px 40px; flex-basis: 560px; margin: auto; box-shadow: 0px 0px 7px 2px #1c1c1c; background-color:#282828;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 24px; margin-bottom: 30px;">Hi '+userObj.firstName+', you have signed up for your first session on Virdio, awesome!. We are glad to have you on Virdio, lets make sure everything works well on your primary device by clicking on the "Lets Setup Your Device" link below</p><p class="button_cont" style="padding-top: 60px; padding-bottom: 60px; text-align: center;"><a href="'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'" class="button1" style="padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 18px; text-decoration: none !important;">Lets Setup Your Device</a></p></div><p style="text-align: center; color: white; font-size: 20px; margin-bottom: 10px;">If the above link is not working, then copy and paste the following URL in the browser address bar</p><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="" style="color: white; text-decoration: none;">'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'</a> </div><p style="text-align: center; color: white; font-size: 20px; margin-bottom: 10px;">Finally, here is a <a href="'+process.env.DOCS_PATH+'/docs/help/Participant_Guide.pdf" class="mx-2">link</a> to a guide to help you through the process.</p><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div></body>';				
							//console.log('-------html--------',html)

							let to=email;
							let subject='Link to download Virdio Remote App!';
		//let subject='Virdio Onboarding – Open Email on device you plan to host the session on.';
							let text='Please Check ur Mail';
			
							let sendmail = await SendMail.emailInput(to,subject,html);

							let updateFirstSignup = await userModel.UpdateFirstSignup(email);

							}

							let updateuserStat = await userModel.UpdateUserStatus(email);


							if(userObj.type == 2)
							{
				let sessionAfetr30Min = await sessionModel.getsessionExistAfter30Min(userObj.id);
				console.log('------sessionAfetr30Min------------',sessionAfetr30Min.length)
							if(sessionAfetr30Min.length > 0)
							{
								userObj = underscore.extend(userObj, {sessionExistIn30Min:"yes"});
							}else{
								userObj = underscore.extend(userObj, {sessionExistIn30Min:"no"});
							}
							}else{
								userObj = underscore.extend(userObj, {sessionExistIn30Min:"no"});
							}

							response.resp(res, 200, userObj)
						} else {
							// res.status(400).send({message:"Something went wrong."});
							//response.resp(res, 400, {message:"Something went wrong."})
							let msg="OTP Not Updated";
							response.resp(res, 417, msg)
						}
					} else {
						let errorMsg = 'OTP already Verified';
						if(otpObj.status == 2)
							errorMsg = 'OTP Expired';
						else if(otpObj.status == 3)
							errorMsg = 'OTP Failed';

						// res.status(400).send({message:errorMsg});
						//response.resp(res, 400, {message:errorMsg})

						response.resp(res, 417, errorMsg)
					}
				} else {

					// res.status(400).send({message:"Invalid OTP"});
					//response.resp(res, 400, {message:"Invalid OTP"})

					let msg="Invalid OTP";
				response.resp(res, 417, msg)
				}

			} else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				//response.resp(res, 400, {email:"User doesn\'t exists in system."})

				let msg="User doesn\'t exists in system";
				response.resp(res, 417, msg)
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async getuserTokenDetail(req, res) {
	    try {
			console.log('------req.body----------',req.body)
			let email = req.body.email;
			let userObj = await userModel.getExistsUserByEmail(email);
			if(!isEmpty(userObj)){

				const token = await auth.createToken(userObj.id);
				console.log('token-1111------------',token);
			   let updateUser = await tokenModel.updateToken(userObj.id, token);
			   
			   userObj = underscore.extend(userObj, {token:token});

			   userObj = underscore.omit(userObj, 'password');
			   userObj = underscore.omit(userObj, 'status');
			   //userObj = underscore.omit(userObj, 'isBanned');

			   response.resp(res, 200, userObj)

			}else {
				// res.status(400).send({email:"User doesn\'t exists in system."});
				//response.resp(res, 400, {email:"User doesn\'t exists in system."})

				let msg="User doesn\'t exists in system";
				response.resp(res, 417, msg)
			}						
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async forgotPassword(req, res) {
		try {
			let email = req.body.email;

			let userObj = await userModel.getExistsUserByEmail1(email);
			
			if(!isEmpty(userObj)){

				let otpObj = await otpModel.check(userObj.id, 0, 0);
				let code='';
				// check if otp already sent
				if(!isEmpty(otpObj)){
					code = otpObj.code;
					console.log('--------code1--------',code);

				} else {
					
					code = utils.encodedString();

					console.log('--------code2--------',code);

					let emailUpdate = await otpModel.add(userObj.id, code, 0);
				}

				let resultant_code = await utils.encodedDecodedString(code,0);

				//console.log('-------resultant_code--------',resultant_code)

				let encoded_email = await utils.encodedDecodedString(email,0);

				//console.log('-------encoded_email12--------',encoded_email) 

				//console.log('-------process.cwd()--------',process.cwd())

				let html='<p>Click <a href="'+process.env.DOMAIN_URL+"/"+ encoded_email+"/"+resultant_code + '">here</a> to reset your password</p>';

				console.log('-------html--------',html)

				let to=email;
				let subject='Mail From Virdio';
				let text='Please Check ur Mail';

				let sendmail = await SendMail.emailInput(to,subject,html);

				let msg = 'Email has been sent to your email id';

				// res.status(200).send({message:msg, link: code });
				response.resp(res, 200, {message:msg, link: code })

			} else {
				// res.status(400).send({email:"Email doesn\'t exists in system."});
				//response.resp(res, 400, {email:"Email doesn\'t exists in system."})
				let msg="Email doesn\'t exists in system";
				response.resp(res, 417, msg)
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async verifyLink(req, res) {
		try {

	    	let email = req.body.email;
			let otpcode = req.body.otpcode;
			
			console.log('----------email------otpcode-----',email,otpcode)

			let decoded_email = await utils.encodedDecodedString(email,1);


			 let emailObj = await userModel.getExistsUserByEmail(decoded_email);


			if(!isEmpty(emailObj)){

				let decoded_otp = await utils.encodedDecodedString(otpcode,1);


				let otp_exist = await otpModel.otpExist(emailObj.id, decoded_otp, 0);


				if(!isEmpty(otp_exist)){

				let msg = 'your link is verified';


				res.status(200).send({message:msg, link:decoded_email });

				}else {
					//res.status(400).send({email:"OTP is not Valid."});

					let msg="OTP is not Valid";
				response.resp(res, 417, msg)
				}

			}else {
				//res.status(400).send({email:"Email not exists in system."});

				let msg="Email doesn\'t exists in system";
				response.resp(res, 417, msg)
			}
			
			//res.status(200).send({message:"Account activated successfully."});

	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async updatePassword(req, res) {
		try {

			let email = req.body.email;
			
			console.log('-------------email12345------------------',email)

			let userObj = await userModel.getExistsUserByEmail1(email);

			console.log('-------------userObj------------------',userObj)

			if(!isEmpty(userObj)){

				let password = await bcrypt.hash(req.body.password, saltRounds);

				console.log('-------------password------------------',password)

				let output= await userModel.updatePassword(email,password);

				console.log('-------------output------------------',output)

				res.status(200).send({message:"password updated"});

			}else {
				if(userObj.status == 0){

					//res.status(400).send({message:"Email  exists but inactive."})

					let msg="Email  exists but inactive.";
				response.resp(res, 417, msg)
				} else {

					//res.status(400).send({message:"Email Doesnot exists."})


					let msg="Email Doesnot exists.";
				response.resp(res, 417, msg)
				}
			}

			
	    } catch(exception) {
			res.status(500).send(exception)
	    }
	}

	async changeUserRole(req, res) {
	    try {

			console.log('--------req.body----------',req.body)
			let email = req.body.email;
			let type=req.body.userType;
			let updateResult = await userModel.updateUserRole(email,type);
			// res.status(200).send(user1);
			response.resp(res, 200, updateResult)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async onBoardingUser(req, res) {
		try {		
			console.log('-------lalit111111111------------',req.body)
				


			let encodedData=req.body.data;

				
			let decoded_d = await utils.encodedDecodedString(req.body.data,1);

			console.log('-------llltttttt------------',decoded_d)

			 let decodedData = decoded_d.split("#");

			 console.log('-------sessdta------------',decodedData)

			 let emailId= decodedData[0];
			 let firstName= decodedData[1];
		
			//let userObj = await userModel.getExistsUserByEmail(emailId);
	
		response.resp(res, 200, {firstName:firstName, emailId:emailId, encodedData:encodedData})
			} catch(exception) {
			response.resp(res, 500, exception);
		}
	}

	async onBoardingUserMail(req, res) {
		try {		
			console.log('-------lalit111111111------------',req.body)
				
			let email=req.body.email;
			let type=req.body.type;

			let userObj = await userModel.getExistsUserByEmail(email);

			if(!isEmpty(userObj)){
			let link =''
			if(type == "1")
			{
				let iosLink ="https://apps.apple.com/us/app/virdio/id1489704718";
				//link = iosLink ;
			}else{
		let androidLink ="https://play.google.com/store/apps/details?id=mvvm.f4wzy.com.virdioApp";
				//link = androidLink ;
			}
			
			let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 35px 20px 35px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj.firstName+', get your remote by pressing the below button</p></div><div style="text-align: center; margin-top: 50px;"><p style="font-size: 20px; padding:10px 25px; text-align: center; background-color: #b80df7; display: inline-block;"><a href="'+iosLink+'" style="text-decoration: none; color: white;">Get Virdio iOS App</a></p></div><div style="text-align: center; margin-top: 35px;"><p style="font-size: 20px; padding:10px 25px; background-color: #b80df7; display: inline-block; text-align: center;"><a href="'+androidLink+'" style="text-decoration: none; color: white;">Get Virdio Android App</a></p></div><div class="remote" style="background-color:#343434; margin-top: 150px; padding:10px; margin-bottom: 40px; display: flex; position: relative;"> <div style="width: 40%; height: 100%"> <img src="'+process.env.IMAGE_PATH+'/images/remote.png" style="width: 35%; position: absolute; bottom: 0px; left: -10px;"/> </div><p style="font-size: 22px; color: white; width: 60%;"> Use your Virdio Remote App to manage your session</p></div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';

					
			//console.log('-------html--------',html)

			let to=email;
			let subject='Link to download Virdio Remote App!';
			let text='Please Check ur Mail';

			let sendmail = await SendMail.emailInput(to,subject,html);	
			
		response.resp(res, 200, {msg:"A mail has been sent to your emailId"})
			}else{
				let msg="Email Doesnot exists.";
				response.resp(res, 417, msg)
			}
			} catch(exception) {
			response.resp(res, 500, exception);
		}
	}


}

module.exports = new UserCtrl();