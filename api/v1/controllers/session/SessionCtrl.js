const auth = require('../../auth/Auth');
const isEmpty = require("is-empty");
const bcrypt = require('bcrypt');
const underscore = require("underscore");
const axios = require("axios");
const moment = require("moment");
var moment1 = require('moment-timezone');
const sessionModel = require('../../models/Session');
const sessionUserModel = require('../../models/SessionUser');
const userModel = require('../../models/User');
const memberModel = require('../../models/Member');
const settingModel = require('../../models/Settings');
const defaultConfig = require(process.cwd() + '/config/default.config');
const sessionConfigMappingModel = require('../../models/SessionConfigMapping');
const sessionHistoryModel = require('../../models/sessionHistory');
const sessionScriptModel = require('../../models/SessionScript');
const sessionScriptMappingModel = require('../../models/SessionScriptMapping');
const scriptAttributesModel = require('../../models/ScriptAttributes');
const channelHostModel = require('../../models/ChannelHost');
const InterestEquipmentModel = require('../../models/InterestEquipment');
const InterestShoppingModel = require('../../models/InterestShoppingList');
const ActivityTypeModel = require('../../models/ActivityType');
const SessionEmojiesModel = require('../../models/SessionEmojies');
const SessionEquipmentMappingModel = require('../../models/SessionEquipmentMapping');
const SessionShoppingListModel = require('../../models/SessionShoppingList');
const EmojiesModel = require('../../models/Emojies');
const ChannelsModel = require('../../models/Channels');
const ChannelProductModel = require('../../models/ChannelProduct');
const ChannelInterestModel = require('../../models/ChannelInterest');
const activityLogsModel = require('../../models/ActivityLogs');
const clientToken = require( process.cwd() + '/util/ClientToken');
const utils = require(process.cwd() + '/util/Utils');
const response = require(process.cwd() + '/util/Response');
const SendMail = require(process.cwd() + '/util/SendMail');
// include node fs module


const AWS = require('aws-sdk');
const fs = require('fs');

const ID = process.env.ACCESS_KEY;
const SECRET = process.env.SECRET_KEY;
const REGION = process.env.REGION;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region:REGION
});

const saltRounds = 10;

class SessionCtrl {

	async getSessions(req, res) {
	    try {
			let sessionObj = await sessionModel.findAllSessionById(req.currentUser.id);

			// res.status(200).send(sessionObj);
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async getSessionDetail(req, res) {
	    try {
			console.log('------------------in sessiondetail function')
			let sessionObj = await sessionModel.findSessionDetail(req.params.sessionId, req.currentUser.id);

			// console.log('sessionObj =============== ',sessionObj);
			
			if(true !== underscore.isEmpty(sessionObj)){
				let token = clientToken.createToken(sessionObj.appId, sessionObj.appCertificate, sessionObj.channelId, sessionObj.userId);
				sessionObj = underscore.extend(sessionObj, {token : token});
				sessionObj = underscore.omit(sessionObj, 'appCertificate');
			}

			// res.status(200).send(sessionObj);
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async getSessionShppingandEquipmentList(req, res) {
	    try {
			//let userId=11;
			let userId=req.currentUser.id;
			console.log('--------userId--------',userId);
			let sessionObj = await sessionModel.getSessionDetailDTA(req.params.sessionId,userId);

			 console.log('sessionObj =============== ',sessionObj);

			if(true !== underscore.isEmpty(sessionObj)){
				let shoppingList = await SessionShoppingListModel.getSessionshoppingDTA(req.params.sessionId)
				console.log('-----shoppingList--------',shoppingList)	
				if(!isEmpty(shoppingList)){			
				sessionObj = underscore.extend(sessionObj, {shoppingList : shoppingList});
				}
				let equipmentList = await SessionEquipmentMappingModel.getSessionEquipmentDTA(req.params.sessionId)

				console.log('-----equipmentList--------',equipmentList)	
				if(!isEmpty(equipmentList)){	
				sessionObj = underscore.extend(sessionObj, {equipmentList : equipmentList});
				}
				
			}
			
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}
	
	async getSessionUsers(req, res) {
	    try {
			let userObj = await sessionModel.findSessionUsers(req.params.sessionId);

		//	console.log('---------------------userObj',userObj)

				let newArr=[];
			if(!isEmpty(userObj)){
				for(let i in userObj){

					if(isEmpty(userObj[i].image)){
						userObj[i].image = process.env.IMAGES + 'profile.png';
					} else {
						userObj[i].image = process.env.IMAGES + userObj[i].image;
					}

					let attrData= userObj[i];
					//console.log('---------------------attrData',attrData)
					//console.log('---------------------attrData11111',attrData.userType,attrData.hostStatus)
					if(attrData.userType == 1 && attrData.hostStatus == 1)
					{
						newArr.push(attrData);
					}else if(attrData.userType == 2 && attrData.hostStatus == 0)
					{
						newArr.push(attrData);
					}				 
			
				}

				underscore.extend(newArr, newArr);
			}
			// res.status(200).send(userObj);
			response.resp(res, 200, newArr)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateSessionUser(req, res) {
	    try {
			let updateData = await sessionUserModel.updateCurrentSessionType(req.params.userId, req.params.sessionId, req.body.state);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateUserStream(req, res) {
	    try {
			let updateData = await sessionUserModel.updateConferenceUser(req.currentUser.id,  req.params.sessionId, req.body.streamId);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateSessionStatus(req, res) {
	    try {
			let updateData = await sessionUserModel.updateSessionUser(req.currentUser.id,  req.params.sessionId);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
			
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async updateSessionjoinStatus(req, res) {
	    try {
			let updateData = await sessionUserModel.updatejoinSessionUser(req.currentUser.id,  req.params.sessionId);
			// res.status(200).send(updateData);
			response.resp(res, 200, updateData)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	async getStreamUser(req, res) {
		try {
			// console.log(req.params);
			let sessionObj = await sessionUserModel.findByStreamUser(req.params.sessionId, req.params.userId);
			// res.status(200).send(sessionObj);
			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	/**
	 * Log for running session activity
	 * @param  {obj} req
	 * @param  {obj} res
	 * @return {obj}
	 */
	async activityLogs(req, res) {
		try{
			console.log('req.body=====', req.body);
			let insertData = {
				userId : req.currentUser.id,
				sessionId : req.body.sessionId,
				userType : req.body.userType,
				type : req.body.type
			};
			let insertedId = await activityLogsModel.add(insertData);

			if(insertedId > 0){
				// res.status(200).send({logId : insertedId});
				response.resp(res, 200, {logId : insertedId})
			} else {
				// res.status(400).send({message:"Something went wrong."})
				response.resp(res, 500, {message:"Something went wrong."})
			}
		} catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
		}
	}





	async getSessionsByChannel(req, res) {

		//let userId = 11;
		//let userId = req.currentUser.id;
		 console.log('------asdds+++++lalit-----------',req.params.channelId);
	    try {			
			let sessionObj = await sessionModel.findAllPrevSessionByChannel(req.params.channelId);
			// console.log('sessionObj======lalit--------=======',sessionObj);
			 response.resp(res, 200, sessionObj);			
			} catch(exception) {
				response.resp(res, 500, exception);
			}
		}

	async getSessions1(req, res) {
	    try {
			let sessionObj = await sessionModel.findAllSessionById(req.currentUser.id);

			response.resp(res, 200, sessionObj);			
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getemojiesbysessionProduct(req, res) {
	    try {
			let sessionId = req.params.sessionId;

			console.log('---------sessionId1123454444444----------------',sessionId)

			let sessiondetail = await sessionModel.findSessionDetailBySessId(sessionId);

			let scriptDetail = await sessionScriptModel.getProducts(sessionId);

			console.log('--------scriptDetail------',scriptDetail)
			
			if(!isEmpty(scriptDetail)){
				
				for(let k in scriptDetail)
				{

				let attrData= scriptDetail[k];
					
				let scriptEmojiesType = await SessionEmojiesModel.getEmojiesGroup(sessionId,attrData.id,sessiondetail.interestId);

			console.log('-----------scriptEmojiesType',scriptEmojiesType)
			if(!isEmpty(scriptEmojiesType)){

				underscore.extend(attrData, {Emojies : scriptEmojiesType});

				if(sessiondetail.interestId !=2)
				{

				for(let p in scriptEmojiesType)
				{

					let attrData2= scriptEmojiesType[p];
					let sessionEmojies= await SessionEmojiesModel.getEmojiesBySessionScriptIds(sessionId,attrData.id,attrData2.emojiesGroup);

					console.log('---------sessionEmojies-------------',sessionEmojies)
					let newArr2=[];
					if(!isEmpty(sessionEmojies)){
					
					for(let r in sessionEmojies)
					{
						let attrData3= sessionEmojies[r];
						newArr2.push(attrData3);
					}
					newArr2 = underscore.filter(newArr2 , function(data){
						return data != null;
					 });
					
					}
					underscore.extend(attrData2, {emojiesDetail : newArr2});

							}
						}

				
					}else{
						underscore.extend(attrData, {Emojies : []});
					}
					
				}

			underscore.extend(scriptDetail, scriptDetail);
			response.resp(res, 200, scriptDetail);
			}else{

				//response.resp(res, 400, {massage : "There is no any product for this session"});

				let msg="There is no any product for this session";
				response.resp(res, 417, msg)

			}
					
						
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async individualSessionDetail(req, res) {
	    try {
			let userObj = await userModel.getUserdetailById(req.currentUser.id);
			console.log('--------userObj----------',userObj);
			let currentTS = Date.now();
			if(!isEmpty(userObj)){

			userObj = underscore.extend(userObj, {serverTimestamp:currentTS});

			
			if(isEmpty(userObj.image)){
				userObj.image = process.env.IMAGES + 'profile.png';
			} else {
				userObj.image = process.env.IMAGES + userObj.image;
			}
			
			
			let sessiondetail = await sessionModel.individualSessDetail(req.params.sessionId,req.currentUser.id);
			console.log('--------------sessiondetail----------------',sessiondetail)
			sessiondetail = sessiondetail[0];		
			let sessionData = {};
			if(!isEmpty(sessiondetail)){
				console.log('--------------sessiondetail.id----------------',sessiondetail.id)
				let sessionHost = await sessionUserModel.getSessionHost(sessiondetail.id);
				console.log('--------------sessionHost----------------',sessionHost)
				if(sessionHost.length > 0)
				{
					underscore.extend(sessiondetail, {hostId : sessionHost[0].hostId});
					underscore.extend(sessiondetail, {hostFirstName : sessionHost[0].hostFirstName});
					underscore.extend(sessiondetail, {hostLastName : sessionHost[0].hostLastName});
					underscore.extend(sessiondetail, {hostEmail : sessionHost[0].hostEmail});
					underscore.extend(sessiondetail, {hostImage : sessionHost[0].hostImage});
				}
				console.log('-----------sessionHost11111--------',sessionHost)
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
				console.log('--------agoraConfig------',agoraConfig)
				if(!isEmpty(agoraConfig)){
					for(let i in agoraConfig){
						if(agoraConfig[i].type == 1){
							underscore.extend(sessiondetail, {appId: agoraConfig[i].appId});
							// generate streaming token
							let streamToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, sessiondetail.channelId, sessiondetail.userId);
							console.log('--------streamToken------',streamToken)
							// dummy token for bandwidth check
							let channelUid = 9999999999 + '' + sessiondetail.channelId + '' + req.currentUser.id;
							
							let streamDummyToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, channelUid, sessiondetail.userId);
							console.log('--------streamDummyToken------',streamDummyToken)
							underscore.extend(sessiondetail, {streamToken : streamToken});
							underscore.extend(sessiondetail, {streamDummyToken : streamDummyToken});
							// sessiondetail = underscore.omit(sessiondetail, 'appCertificate');
						} else if(agoraConfig[i].type == 2){
							underscore.extend(sessiondetail, {rtmAppId: agoraConfig[i].appId});
						}
					}
				}

			console.log('--------scriptDetail22222------',sessiondetail.id,sessiondetail.sessionCreatorId,sessiondetail.code)
				let scriptDetail = await sessionScriptModel.getProductDetail(sessiondetail.id, sessiondetail.sessionCreatorId, sessiondetail.code);
				console.log('--------scriptDetail111111------',scriptDetail)
				if(!isEmpty(scriptDetail)){
				underscore.extend(sessiondetail, {scriptDetail : scriptDetail});
				}else{
					underscore.extend(sessiondetail, {scriptDetail : []});
				}
				
				if(isEmpty(sessiondetail.hostImage)){
					sessiondetail.hostImage = process.env.IMAGES + 'profile.png';
				} else {
					sessiondetail.hostImage = process.env.IMAGES + sessiondetail.hostImage;
				}

	
					let shoppingList = await SessionShoppingListModel.getSessionshoppingDTA(req.params.sessionId)
					//console.log('-----shoppingList--------',shoppingList)	
					if(!isEmpty(shoppingList)){			
					sessiondetail = underscore.extend(sessiondetail, {shoppingList : shoppingList});
					}else{
						sessiondetail = underscore.extend(sessiondetail, {shoppingList : []});
					}
					let equipmentList = await SessionEquipmentMappingModel.getSessionEquipmentDTA(req.params.sessionId)
	
					console.log('-----equipmentList--------',equipmentList)	
					if(!isEmpty(equipmentList)){	
						sessiondetail = underscore.extend(sessiondetail, {equipmentList : equipmentList});
					}else{
						sessiondetail = underscore.extend(sessiondetail, {equipmentList : []});
					}

					underscore.extend(userObj, { sessionData : sessiondetail });

				} else {

					underscore.extend(userObj, { sessionData : ''});
					// underscore.extend(userObj, { sessionData : []});
				}
					
					userObj = underscore.omit(userObj, 'password');
					userObj = underscore.omit(userObj, 'status');
					userObj = underscore.omit(userObj, 'isBanned');

						underscore.extend(userObj, defaultConfig);

							let settings = await settingModel.getSettings();

							underscore.extend(userObj, {default: settings});

						
			
			response.resp(res, 200, userObj);	
		} else {
			//response.resp(res, 400, {email:"User doesn\'t exists in system."})
			let msg="User doesn\'t exists in system.";
			response.resp(res, 417, msg)
			}		
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async individualSessionDetailForAdmin(req, res) {
	    try {
			let sessObj = await sessionModel.findSessionDetailBySessId(req.params.sessionId);
			let userObj = await userModel.getUserdetailById(sessObj.hostId);
			console.log('--------userObj----------',userObj);
			let currentTS = Date.now();
			if(!isEmpty(userObj)){

			//userObj = underscore.extend(userObj, {serverTimestamp:currentTS});

			
			if(isEmpty(userObj.image)){
				userObj.image = process.env.IMAGES + 'profile.png';
			} else {
				userObj.image = process.env.IMAGES + userObj.image;
			}
		
			let sessiondetail = await sessionModel.individualSessDetailForAdm(req.params.sessionId,sessObj.hostId);
			sessiondetail = sessiondetail[0];		
			let sessionData = {};
			if(!isEmpty(sessiondetail)){

				let sessionHost = await sessionUserModel.getSessionHost(sessiondetail.id);
				let totalSignup = await sessionUserModel.getTotalSignup(sessiondetail.id);
				if(sessionHost.length > 0)
				{
					underscore.extend(sessiondetail, {hostId : sessionHost[0].hostId});
					underscore.extend(sessiondetail, {hostFirstName : sessionHost[0].hostFirstName});
					underscore.extend(sessiondetail, {hostLastName : sessionHost[0].hostLastName});
					underscore.extend(sessiondetail, {hostEmail : sessionHost[0].hostEmail});
					underscore.extend(sessiondetail, {hostImage : sessionHost[0].hostImage});
					underscore.extend(sessiondetail, {totalSignUp : totalSignup.length});
				}
				console.log('-----------sessionHost11111--------',sessionHost)
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
				console.log('--------agoraConfig------',agoraConfig)
				if(!isEmpty(agoraConfig)){
					for(let i in agoraConfig){
						if(agoraConfig[i].type == 1){
							underscore.extend(sessiondetail, {appId: agoraConfig[i].appId});
							// generate streaming token
							let streamToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, sessiondetail.channelId, sessiondetail.userId);
							console.log('--------streamToken------',streamToken)
							// dummy token for bandwidth check
							let channelUid = 9999999999 + '' + sessiondetail.channelId + '' + sessObj.hostId;
							
							let streamDummyToken = clientToken.createToken(agoraConfig[i].appId, agoraConfig[i].appCertificate, channelUid, sessiondetail.userId);
							console.log('--------streamDummyToken------',streamDummyToken)
							underscore.extend(sessiondetail, {streamToken : streamToken});
							underscore.extend(sessiondetail, {streamDummyToken : streamDummyToken});
							// sessiondetail = underscore.omit(sessiondetail, 'appCertificate');
						} else if(agoraConfig[i].type == 2){
							underscore.extend(sessiondetail, {rtmAppId: agoraConfig[i].appId});
						}
					}
				}

					console.log('------------sessiondetail111111111----------------',sessiondetail)
				let scriptDetail = await sessionScriptModel.getProductDetail(sessiondetail.id, sessiondetail.sessionCreatorId, sessiondetail.code);

				console.log('--------scriptDetail------',scriptDetail)
				
				if(!isEmpty(scriptDetail)){
					
				underscore.extend(sessiondetail, {scriptDetail : scriptDetail});
				}else{
					underscore.extend(sessiondetail, {scriptDetail : []});
				}
				
				if(isEmpty(sessiondetail.hostImage)){
					sessiondetail.hostImage = process.env.IMAGES + 'profile.png';
				} else {
					sessiondetail.hostImage = process.env.IMAGES + sessiondetail.hostImage;
				}

	
					let shoppingList = await SessionShoppingListModel.getSessionshoppingDTA(req.params.sessionId)
					//console.log('-----shoppingList--------',shoppingList)	
					if(!isEmpty(shoppingList)){			
					sessiondetail = underscore.extend(sessiondetail, {shoppingList : shoppingList});
					}else{
						sessiondetail = underscore.extend(sessiondetail, {shoppingList : []});
					}
					let equipmentList = await SessionEquipmentMappingModel.getSessionEquipmentDTA(req.params.sessionId)
	
					console.log('-----equipmentList--------',equipmentList)	
					if(!isEmpty(equipmentList)){	
						sessiondetail = underscore.extend(sessiondetail, {equipmentList : equipmentList});
					}else{
						sessiondetail = underscore.extend(sessiondetail, {equipmentList : []});
					}

				 	underscore.extend(userObj, { sessionData : sessiondetail });

				} else {

					underscore.extend(userObj, { message : "There are no sessions available."});
					// underscore.extend(userObj, { sessionData : []});
				}
					
					userObj = underscore.omit(userObj, 'password');
					userObj = underscore.omit(userObj, 'status');
					userObj = underscore.omit(userObj, 'isBanned');

						underscore.extend(userObj, defaultConfig);

							let settings = await settingModel.getSettings();

							underscore.extend(userObj, {default: settings});

						
			
			response.resp(res, 200, userObj);	
		} else {
			// res.status(400).send({email:"User doesn\'t exists in system."});
			let msg="User doesn\'t exists in system.";
			response.resp(res, 417, msg)
			}		
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async createSession(req, res) {
	    try {
			let userId=req.currentUser.id;
			//let userId=11;
			
		console.log('-------userId-----------',userId)
			if(true === isEmpty(req.body.activities)){
				let msg1="Please select at list One Script!";

				response.resp(res, 417, msg1)
			}
		
			//let sessionChannelId11 ='';

			if(true === isEmpty(req.body.session.sessionChannelId)){
				//if(true === isEmpty(sessionChannelId11)){
				let msg14="Please select atlist one channel!";

				response.resp(res, 417, msg14)
			}

				console.log('----------req.body------------------',req.body)

			if(false === isEmpty(req.body)){
		
			let date_ob = new Date(req.body.session.start_date);
			let date_ob3 = new Date(req.body.session.start_date);

			console.log('----------date_ob------------------',date_ob)
			

			let date = ("0" + date_ob3.getDate()).slice(-2);
			let month = ("0" + (date_ob3.getMonth() + 1)).slice(-2);
	    	let year = date_ob3.getFullYear();
			let hours = ("0" + date_ob3.getHours()).slice(-2);
			let minutes = ("0" + date_ob3.getMinutes()).slice(-2);
			let seconds = ("0" + date_ob3.getSeconds()).slice(-2);


			let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

			console.log('------currentDate--------',currentDate)

			
			let sessionEndTimeinMinutes=date_ob3.setMinutes(date_ob3.getMinutes() + req.body.session.duration );
			
			let sessionEndTime = new Date(sessionEndTimeinMinutes);

			console.log('------sessionEndTime--------',sessionEndTime)


			let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
			let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
	    	let year1 = sessionEndTime.getFullYear();
			let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
			let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
			let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);


			let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;


			//let sessionObj = await sessionModel.checkDuplicateSession(userId, req.body.session.name);

			//let getSessionAtTime = await sessionModel.getSessionScheduleDate(userId, currentDate,endDate);

			let userId11111='';
			if(req.body.host_list.hostList.length > 0)
			{
				let hostlist1=req.body.host_list.hostList;
				//console.log('--------hostlist1[0]------------',hostlist1[0])
				 userId11111=hostlist1[0];
			}else{
				userId11111=req.currentUser.id;
			}

			let getSessionAtTime = await sessionModel.getSessionScheduleDate(userId11111, currentDate,endDate);

			console.log('------------getSessionAtTime---------------',getSessionAtTime)
			let errM ='';
			if (getSessionAtTime.length > 0) {
			// for(let k in getSessionAtTime)
			// {
			//let scheduleDate1 =  getSessionAtTime[k].scheduleDate;
			let scheduleDate1 =  getSessionAtTime[0].scheduleDate;
			//let sessName1 =  getSessionAtTime[k].name;
			let sessName1 =  getSessionAtTime[0].name;
			let startTime = new Date(scheduleDate1);
			//console.log('------------startTime11---------------',startTime)

			let date3 = ("0" + startTime.getDate()).slice(-2);
			let month3 = ("0" + (startTime.getMonth() + 1)).slice(-2);
	    	let year3 = startTime.getFullYear();
			let hours3 = ("0" + startTime.getHours()).slice(-2);
			let minutes3 = ("0" + startTime.getMinutes()).slice(-2);
			let seconds3 = ("0" + startTime.getSeconds()).slice(-2);


			let newstartTime= year3+'-'+month3+'-'+date3+' '+hours3 + ':' + minutes3 + ':' + seconds3;

	
			//let sessionEndDate1 =  getSessionAtTime[k].sessionEndDate;
			let sessionEndDate1 =  getSessionAtTime[0].sessionEndDate;
			let endTime = new Date(sessionEndDate1);


			let date4 = ("0" + endTime.getDate()).slice(-2);
			let month4 = ("0" + (endTime.getMonth() + 1)).slice(-2);
	    	let year4 = endTime.getFullYear();
			let hours4 = ("0" + endTime.getHours()).slice(-2);
			let minutes4 = ("0" + endTime.getMinutes()).slice(-2);
			let seconds4 = ("0" + endTime.getSeconds()).slice(-2);


			let newendTime= year4+'-'+month4+'-'+date4+' '+hours4 + ':' + minutes4 + ':' + seconds4;



			errM="You currently have an overlapping session,[ "+sessName1+", "+newstartTime+"], during the time you are trying to schedule this session. Please change the time of this session or cancel/modify time of the overlapping session.!";
				
			// if(date_ob.getTime() >= startTime.getTime()  &&  date_ob.getTime() <= endTime.getTime())
	
			}

			if (true === isEmpty(errM)) {
			
			let date11111= new Date();
			let time = date11111.getTime();
			//console.log('----------req.bodylalit111------------------',req.body)

		//	let sessionDetail = await sessionModel.getSession();
			//console.log('----------sessionDetail1------------------',sessionDetail)
		
			//console.log('----------time------------------',time)
		
			let channelId=userId+time;
			let rtmChannelId=userId+1+time;

			//console.log('---------------------------newsessionDetail',channelId,rtmChannelId)
			
			let hostReminder ='';
			let participantsReminder='';
			let cutOffTime='';
			let minNotMetNoticeTime='';

			if(false === isEmpty(req.body.reminder)){
				hostReminder = req.body.reminder.host_reminder ? req.body.reminder.host_reminder :null;
				participantsReminder = req.body.reminder.participants_reminder ? req.body.reminder.participants_reminder : null;
				cutOffTime = req.body.reminder.cutoff_date_time ? req.body.reminder.cutoff_date_time :null;
				minNotMetNoticeTime = req.body.reminder.min_participants_not_met ? req.body.reminder.min_participants_not_met : null;
			}else{
			
				hostReminder = null;
				participantsReminder = null;
				cutOffTime =null;
				minNotMetNoticeTime = null;
			}

	
			//console.log('------currentDate11111111111111---------',currentDate)

			let sessName= req.body.session.name.trim();

			let sessDesc= req.body.session.description.trim();
			let chageValue= req.body.session.sessionProperty ? 1 :0;

			let insertData = {	
				interestId : 2,
				isTutorialRead : 0,
			//	isDefaultSession : 0,
				isTutorialStart : 0,
				charges :chageValue,
				groupId : req.body.session.groupId ? req.body.session.groupId : 1,
				timeZone : req.body.session.timeZone ? req.body.session.timeZone : "America/New_York",
				sessionChannelId : req.body.session.sessionChannelId ? req.body.session.sessionChannelId : 0,	
				channelId : channelId,
				rtmChannelId : rtmChannelId,
				name : sessName,
				description : sessDesc,
				hostId : userId,
				scheduleDate : currentDate,
				duration : req.body.session.duration,
				sessionEndDate:endDate,
				level : req.body.session.level,
				minAttendee : req.body.session.min_participants,
				maxAttendee : req.body.session.max_participants, 
				currency : 'USD',
				chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
				sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
				//showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
				showParticipantsCount : req.body.session.searchParticipant == true ? 1 : 0,
				sessionProperty : req.body.session.sessionProperty == true ? 1 : 0,
				onDemand : req.body.session.onDemand == true ? 1 : 0,
				orderWine : req.body.session.orderWine == true ? 1 : 0,
				hostReminder : hostReminder,
				participantReminder : participantsReminder,
				cutOffTime : cutOffTime,
				minNotMetNoticeTime : minNotMetNoticeTime,
				displayScript : 1,
				participantDisableDM : req.body.privacy.allow_participants_disable_dm == true ? 1 : 0,
				participantsPickPlaylist : req.body.privacy.allow_participants_pick_playlist == true ? 1 : 0,
				showParticipantsPicToOtherPartcipants : req.body.privacy.show_part_pic_to_other_part == true ? 1 : 0,
				allowGroupLocation : req.body.groups.allow_group_location == true ? 1 : 0,
				activity : req.body.script.next_activity,
				heartRateMonitor : req.body.script.heart_rate_monitor == true ? 1 : 0,
				zoneTracking : req.body.script.zone_tracking == true ? 1 : 0
			};

			//console.log('----------insertData------------------',insertData)


			// insert into sessions table
			let sessionId = await sessionModel.add(insertData);

			console.log('----------sessionId1111------------------',sessionId)

			if(sessionId > 0){


				//console.log('----------insertData11111------------------',req.body.host_list)

				//let userId=11;
				
				 			
					let c1=2;
					let c2=3;

					let dataval = [
						[ sessionId, c1],
						[ sessionId, c2],            
					];
			
				//	console.log('----------dataval------------------',dataval)

				let sessionconfig = await sessionConfigMappingModel.addSessionConfig(dataval);

	console.log('----------sessionId5555------------------',req.body.host_list.hostList)

			//let sessionUserId1123 = await sessionUserModel.addSessionUser(sessionId,userId);

				if(req.body.host_list.hostList.length != 0)
				{
					let hostlist=[];
					 hostlist=req.body.host_list.hostList;
									 

					 let sessionUserData;

					 for(let i in hostlist){
						 
						//
					let pm = await sessionModel.isMember(sessionId,hostlist[i]);
					let pmv=pm.length>0?1:0;

					console.log("PM AND PMV===>",i, pm.length,pm,pmv);	
						sessionUserData = [[sessionId,hostlist[i],1,1,1,pmv]]
				console.log('----------sessionId23333------------------',sessionUserData)
									
					let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
					
						if(hostlist[i] != userId){
							let pm = await sessionModel.isMember(sessionId,userId);
					        let pmv=pm.length>0?1:0;

							let sessionUserSaveData = [[sessionId,userId,1,0,1,pmv]]
							let sessionUserresult123 = await sessionUserModel.addSessionAnotherhost(sessionUserSaveData);
						}

					 }


				}else{
					let sessionUserUpdated11 = await sessionUserModel.updatedSessionhost(sessionId);
					let sessionUserId = await sessionUserModel.addSessionUser(sessionId,userId);
				}

				let getsessionUserId = await sessionUserModel.getSessionHost(sessionId);
				
			//	console.log('--------------getsessionUserId----------------',getsessionUserId)
				let userId11 ='';
				if(getsessionUserId.length > 0)
				{
					 userId11 = getsessionUserId[0].hostId;
					//userId=	getsessionUserId[0].hostId;				
				}else{
					userId11 = req.currentUser.id
				}

				let sessionUpdt123 = await sessionModel.updateSessionHostBySessId(sessionId,userId11);

				if(req.body.equipment_list.equipmentList.length != 0)
				{
					let equipmentList=[];
					equipmentList=req.body.equipment_list.equipmentList;

					console.log('----------equipment_list------------------',equipmentList)

					 let sessionEquipData;

					 for(let i in equipmentList){
						sessionEquipData = [[sessionId,equipmentList[i].id,equipmentList[i].Quantity,equipmentList[i].Link]]
						console.log('----------sessionEquipData------------------',sessionEquipData)

					let sessionEquipresult = await SessionEquipmentMappingModel.addSessionEquipment(sessionEquipData);
					
					 }


				}

	//console.log('----------shopping_list------------------',req.body.shopping_list.shoppingList)

				if(req.body.shopping_list.shoppingList.length != 0)
				{
					let shoppingList=[];
					shoppingList=req.body.shopping_list.shoppingList;

					//console.log('----------shoppingList------------------',shoppingList)

					 let sessionshopData;

					 for(let i in shoppingList){
						sessionshopData = [[sessionId,shoppingList[i].id,shoppingList[i].Quantity,shoppingList[i].itemNote,shoppingList[i].Link]]
					//console.log('----------sessionshopData------------------',sessionshopData)

					let sessionshopresult = await SessionShoppingListModel.addSessionshoppingList(sessionshopData);
					//console.log('-------session shopping data will be inserted-------')
					 }

				
				}


				if(false === isEmpty(req.body.activities)){
					
					let activities = req.body.activities;

					
					let counter12 = 1;
					for(let i in activities){
						//console.log('----------activities------------------',activities[i])
						var attributes = [];

						let sessionScriptInsertData = {	
											interestId : 2,			
											name : activities[i].name,
											description : '',
											userId : userId11,
											//userId : 11,
										}

			 			// insert into session_script table
						let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);

			 			// insert into session_script_mapping table
						sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});

						let activityAttributes = activities[i].attributes;
						let newval = '';
						for(let j in activityAttributes){

							//console.log('----------activityAttributes------------------',activityAttributes[i])

							var attributesArr = [];
							let attrVall =''


							//console.log('----------activities[i].attributes[j].attrKey------------------',activities[i].attributes[j].attrKey)

							// if(activities[i].attributes[j].attrKey == "Duration" && activities[i].attributes[j].attrValue == "Reps")
							// {
							// 	 newval = activities[i].attributes[j].attrValue;														
							// }

							// if(activities[i].attributes[j].attrKey == "counter"  &&  newval != "Reps")
							// {
															
							// 	 attrVall = 60*activities[i].attributes[j].attrValue;
							// }else{
									
							// 	attrVall= activities[i].attributes[j].attrValue;
							// }

							//console.log('attrVall-----------',attrVall)
							attributesArr.push(sessionScriptId);
							attributesArr.push(activities[i].attributes[j].attrKey);
							attributesArr.push(activities[i].attributes[j].attrValue);
							//attributesArr.push(attrVall);								
							attributesArr.push(1);
							//attributesArr.push(activities[i].attributes[j].orderNo);
							attributesArr.push(counter12);

							attributes.push(attributesArr);
						}

						let scriptAttributeId = await scriptAttributesModel.add(attributes);

						counter12++;
					}
				}else{

					let msg2="Please select at list One Script!";
	
					response.resp(res, 417, msg2)

				}


		
				// res.status(200).send({logId : insertedId});

				let sessId=sessionId+100;
				let optcode=sessId+'#'+'virdio';

				let resultant_code = await utils.encodedDecodedString(optcode,0);


				let urlcode=process.env.DOMAIN_URL_FOR_USER+"/"+resultant_code;

				//console.log('-----urlcode-------',urlcode,sessionId)

				let sessionUpdt = await sessionModel.updateSessionDetailBySessId(sessionId,urlcode);
				//console.log('----------sessionUpdt------------',sessionUpdt)	
			let sessionDt = await sessionModel.findSessionDetailBySessId(sessionId);



			let sessionStartTime = new Date(sessionDt.scheduleDate);

			let date = ("0" + sessionStartTime.getDate()).slice(-2);
			let month = ("0" + (sessionStartTime.getMonth() + 1)).slice(-2);
			let year = sessionStartTime.getFullYear();
			let hours = ("0" + sessionStartTime.getHours()).slice(-2);
			let minutes = ("0" + sessionStartTime.getMinutes()).slice(-2);
			let seconds = ("0" + sessionStartTime.getSeconds()).slice(-2);


			//let sessionStartDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

			let sessionStartDate= month+'/'+date+'/'+year;
			let timezone22='';
			if(false === isEmpty(sessionDt.timeZone))
			{
				console.log('--------yes---------')
				timezone22 = sessionDt.timeZone;
			}else {
				console.log('--------no---------')
				timezone22 = "America/New_York";
			}

			let localeSpecificTime = sessionStartTime.toLocaleTimeString('en-US', {timeZone: timezone22});
			let localeSpecificTime1=localeSpecificTime.replace(/:\d+ /, ' ');
			let zoneAbbr=moment1.tz(timezone22).format('z');
			console.log('------nyyyyyyyyyyyyy---',zoneAbbr)
			//console.log('------sessionDt-----------',sessionDt)

			// let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 22px; margin-bottom: 30px;">Hi '+sessionDt.firstName+', your session was successfully created. You can copy the link below and send it to any participant you would like to have sign up for the session. </p></div><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="'+urlcode+'" style="color: white; text-decoration: none;">'+urlcode+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div></body>';



			let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 22px; margin-bottom: 30px;">Channel: '+sessionDt.channelName+',Host: '+sessionDt.firstName+' '+sessionDt.lastName+', When: '+sessionStartDate+'  at '+localeSpecificTime1+' '+zoneAbbr+'</p></div><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="'+urlcode+'" style="color: white; text-decoration: none;">'+urlcode+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">Team Virdio</p><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div></body>';

			//console.log('------html1-----------',html1)

			let toMail=sessionDt.email;
			let subject1='Sign up link for '+sessionDt.name+' on '+sessionStartDate+'';
				let text1='Please Check ur Mail';
	
				let sendmail1 = await SendMail.emailInput(toMail,subject1,html1);

			// let onBoarding = await userModel.getOnBoarding(sessionDt.email);
			//userObj = underscore.extend(userObj, {onBoarding:onBoarding.ifExist});
							
			let FirstSignup = await userModel.getFirstSignup(sessionDt.email);
			console.log('--------FirstSignup----------',FirstSignup)
			if(FirstSignup.isFirstSignup < 1)
			{

			//let encodeEmail=sessionDt.email+'#'+sessionDt.firstName;
		//	let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
			//console.log('-----------encoded_email-----------',encoded_email)

				// let html='<div class="email-box" style="padding: 20px 40px 20px 40px;box-shadow: 0px 0px 7px 2px #1c1c1c; background-color:#282828; font-family: Arial, Helvetica, sans-serif; flex-basis: 500px;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 24px; margin-bottom: 30px;">Hi '+sessionDt.firstName+', congratulations on creating for your first Virdio Session. Lets make sure everything works well on your primary device by clicking on the "Lets Setup Your Device" link below</p><p class="button_cont" style="padding-top: 60px; padding-bottom: 60px; text-align: center;"><a href="'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'" class="button1" style="padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 18px; text-decoration: none !important;">Lets Setup Your Device</a></p></div><p style="text-align: center; color: white; font-size: 20px; margin-bottom: 10px;">If the above link is not working, then copy and paste the following URL in the browser address bar</p><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="" style="color: white; text-decoration: none;">'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'</a> </div><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div>';	
				
				
				let iosLink ="https://apps.apple.com/us/app/virdio/id1489704718";

				let androidLink ="https://play.google.com/store/apps/details?id=mvvm.f4wzy.com.virdioApp";
				
				let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 15px 20px 15px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+sessionDt.firstName+', get your remote by pressing the below button</p></div><div style="text-align: center;"><p style="padding:10px 25px; display: inline-block; background-color: #b80df7; text-align: center; margin-top: 50px;"><a href="'+iosLink+'" style="font-size: 20px; text-decoration: none; color: white;">Get Virdio iOS App</a></p></div><div style="text-align: center;"><p style="padding:10px 25px; display: inline-block; background-color: #b80df7; text-align: center; margin-top: 35px;"><a href="'+androidLink+'" style="font-size: 20px; text-decoration: none; color: white;">Get Virdio Android App</a></p></div></div><div class="remote" style="background-color:#343434; margin-top: 150px; padding:10px; margin-bottom: 40px; display: flex; position: relative;"> <div style="width: 40%; height: 100%"> <img src="'+process.env.IMAGE_PATH+'/images/remote.png" style="width: 35%; position: absolute; bottom: 0px; left: -10px;"/> </div><p style="font-size: 22px; color: white; width: 60%;"> Use your Virdio Remote App to manage your session</p></div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
			
				//console.log('-------html--------',html)

			let to=sessionDt.email;
		//let subject='Virdio Onboarding – Open Email on device you plan to host the session on.';
		let subject='Link to download Virdio Remote App!';
			let text='Please Check ur Mail';

			let sendmail = await SendMail.emailInput(to,subject,html);

			let updateFirstSignup = await userModel.UpdateFirstSignup(sessionDt.email);
			}

				response.resp(res, 200, {urlcode,sessionDt})
			} else {
				response.resp(res, 417, sessionId)

				//response.resp(res, 0, {sessionId})

			} 
		}else {
			//errM
			//let sessNam=getSessionAtTime[k].scheduleDate;
			let msg="You have an already a session";
			response.resp(res, 417, errM)
		}
	}else {
		let msg="Please field at list one field!";
		response.resp(res, 417, msg)
	}
		
		} catch(exception) {
				//console.log('#########23232323@@@@@@@@@@@@@@@@@=====')
				response.resp(res, 500, exception);
			}
		}



		
	async editFitnessSession(req, res) {
			try {
	
				console.log('----------req.bodylalit22222222------------------',req.body)
				let userId111=req.currentUser.id;
				if(true === isEmpty(req.body.activities)){
					let msg1="Please select at list One Script!";
	
					response.resp(res, 417, msg1)
				}

				// if(true === isEmpty(req.body.session.sessionChannelId)){
				// 	//if(true === isEmpty(sessionChannelId11)){
				// 	let msg14="Please select atlist one channel!";
	
				// 	response.resp(res, 417, msg14)
				// }

				if(false === isEmpty(req.body)){

				let date_ob = new Date(req.body.session.start_date);

				//console.log('----------date_ob------------------',date_ob)
				
				let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);

	
				let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

				let sessionEndTimeinMinutes=date_ob.setMinutes(date_ob.getMinutes() + req.body.session.duration );
			
				let sessionEndTime = new Date(sessionEndTimeinMinutes);
	
				//console.log('------sessionEndTime--------',sessionEndTime)
	
	
				let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
				let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
				let year1 = sessionEndTime.getFullYear();
				let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
				let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
				let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);
	
	
				let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;
	
				console.log('------endDate111111--------',endDate)

				let userId11111='';
				if(req.body.host_list.hostList.length > 0)
				{
					let hostlist1=req.body.host_list.hostList;
					//console.log('--------hostlist1[0]------------',hostlist1[0])
					 userId11111=hostlist1[0];
				}else{
					userId11111=req.currentUser.id;
				}

				let getSessionAtTime = await sessionModel.getSameSessionSchedule(userId11111, currentDate,endDate,req.params.sessionId);

				console.log('------------getSessionAtTime---------------',getSessionAtTime)
				let errM ='';
				if (getSessionAtTime.length > 0) {
				// for(let k in getSessionAtTime)
				// {
				//let scheduleDate1 =  getSessionAtTime[k].scheduleDate;
				let scheduleDate1 =  getSessionAtTime[0].scheduleDate;
				//let sessName1 =  getSessionAtTime[k].name;
				let sessName1 =  getSessionAtTime[0].name;
				let startTime = new Date(scheduleDate1);
				//console.log('------------startTime11---------------',startTime)
	
				let date3 = ("0" + startTime.getDate()).slice(-2);
				let month3 = ("0" + (startTime.getMonth() + 1)).slice(-2);
				let year3 = startTime.getFullYear();
				let hours3 = ("0" + startTime.getHours()).slice(-2);
				let minutes3 = ("0" + startTime.getMinutes()).slice(-2);
				let seconds3 = ("0" + startTime.getSeconds()).slice(-2);
	
	
				let newstartTime= year3+'-'+month3+'-'+date3+' '+hours3 + ':' + minutes3 + ':' + seconds3;
	
		
				//let sessionEndDate1 =  getSessionAtTime[k].sessionEndDate;
				let sessionEndDate1 =  getSessionAtTime[0].sessionEndDate;
				let endTime = new Date(sessionEndDate1);
	
	
				let date4 = ("0" + endTime.getDate()).slice(-2);
				let month4 = ("0" + (endTime.getMonth() + 1)).slice(-2);
				let year4 = endTime.getFullYear();
				let hours4 = ("0" + endTime.getHours()).slice(-2);
				let minutes4 = ("0" + endTime.getMinutes()).slice(-2);
				let seconds4 = ("0" + endTime.getSeconds()).slice(-2);
	
	
				let newendTime= year4+'-'+month4+'-'+date4+' '+hours4 + ':' + minutes4 + ':' + seconds4;
	
				errM="You currently have an overlapping session,[ "+sessName1+", "+newstartTime+"], during the time you are trying to schedule this session. Please change the time of this session or cancel/modify time of the overlapping session.!";
							
				}

				if (true === isEmpty(errM)) {

				let hostReminder ='';
				let participantsReminder='';
				let cutOffTime='';
				let minNotMetNoticeTime='';
	
				if(false === isEmpty(req.body.reminder)){
					hostReminder = req.body.reminder.host_reminder ? req.body.reminder.host_reminder :null;
					participantsReminder = req.body.reminder.participants_reminder ? req.body.reminder.participants_reminder : null;
					cutOffTime = req.body.reminder.cutoff_date_time ? req.body.reminder.cutoff_date_time :null;
					minNotMetNoticeTime = req.body.reminder.min_participants_not_met ? req.body.reminder.min_participants_not_met : null;
				}else{
				
					hostReminder = null;
					participantsReminder = null;
					cutOffTime =null;
					minNotMetNoticeTime = null;
				}

				let userId=req.currentUser.id;
				let sessionId=req.params.sessionId;

				let sessionDetail = await sessionModel.findSessionDetailBySessId(sessionId);
				
				let channelId=sessionDetail.channelId;
				let rtmChannelId=sessionDetail.rtmChannelId;
				let sessName= req.body.session.name.trim();
				let sessDesc= req.body.session.description.trim();
				let chageValue= req.body.session.sessionProperty ? 1 :0;
				let sessionChannelId1111=sessionDetail.sessionChannelId;
				let groupId11=sessionDetail.groupId;				
				let insertData = {	
					interestId : 2,
					// groupId : req.body.session.groupId ? req.body.session.groupId : 1,
					// sessionChannelId : req.body.session.sessionChannelId ? req.body.session.sessionChannelId : 1,
					groupId : groupId11 ? groupId11 : 1,				
					sessionChannelId : sessionChannelId1111,			
					channelId : channelId,
					rtmChannelId : rtmChannelId,
					charges:chageValue,
					name : sessName,
					description : sessDesc,
					hostId : userId,
					scheduleDate : currentDate,
					duration : req.body.session.duration,
					sessionEndDate:endDate,
					level : req.body.session.level,
					minAttendee : req.body.session.min_participants,
					maxAttendee : req.body.session.max_participants, 
					currency : 'USD',
					chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
					sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
					//showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
					showParticipantsCount : req.body.session.searchParticipant == true ? 1 : 0,
					sessionProperty : req.body.session.sessionProperty == true ? 1 : 0,
					onDemand : req.body.session.onDemand == true ? 1 : 0,
					orderWine : req.body.session.orderWine == true ? 1 : 0,
					hostReminder : hostReminder,
					participantReminder : participantsReminder,
					cutOffTime : cutOffTime,
					minNotMetNoticeTime : minNotMetNoticeTime,
					displayScript : 1,
					participantDisableDM : req.body.privacy.allow_participants_disable_dm == true ? 1 : 0,
					participantsPickPlaylist : req.body.privacy.allow_participants_pick_playlist == true ? 1 : 0,
					showParticipantsPicToOtherPartcipants : req.body.privacy.show_part_pic_to_other_part == true ? 1 : 0,
					allowGroupLocation : req.body.groups.allow_group_location == true ? 1 : 0,
					activity : req.body.script.next_activity,
					heartRateMonitor : req.body.script.heart_rate_monitor == true ? 1 : 0,
					zoneTracking : req.body.script.zone_tracking == true ? 1 : 0
				};
	
				console.log('----------insertData------------------',insertData)
	
				
	
				// insert into sessions table
				let output = await sessionModel.updateSession(insertData,sessionId);
	
				console.log('----------sessionId1111------------------',output)
	
				if(output > 0){
	
							
					if(req.body.host_list.hostList.length != 0)
					{
						let sessionUserresult111 = await sessionUserModel.updateSessionAnotherhost(sessionId);
						//console.log('----------sessionId55551111------------------',req.body.host_list)
					
						let hostlist=[];
						 hostlist=req.body.host_list.hostList;					 
	
						 let sessionUserData;
	
						 for(let i in hostlist){
							let pm = await sessionModel.isMember(sessionId,hostlist[i]);
							let pmv=pm.length>0?1:0;

							sessionUserData = [[sessionId,hostlist[i],1,1,1,pmv]]
						//	console.log('----------sessionId23333------------------',sessionUserData)
					
						let getsessionUser11 = await sessionUserModel.getSessionExistingHost(sessionId,hostlist[i]);

						//console.log('----------getsessionUser11----------------',getsessionUser11)
						if(getsessionUser11.length < 1)
						{
						let sessionUserUpdated = await sessionUserModel.updatedSessionhost(sessionId);
						let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
						}else{
							let hostStatus=getsessionUser11[0].hostStatus;
							if(hostStatus != 1)
							{
								let updatedSessionUser = await sessionUserModel.updatedSessionhostData(sessionId,hostlist[i]);
							}
						}
						
					}
	
	
					}
					// else{
					// 	let sessionUserUpdated = await sessionUserModel.updatedSessionhost(sessionId);
					// 	let sessionUserId = await sessionUserModel.addSessionUser(sessionId,userId);
					// }
				//}
	



				let getsessionUserId = await sessionUserModel.getSessionHost(sessionId);
				
				console.log('--------------getsessionUserId----------------',getsessionUserId)
				let userId11 ='';
				if(getsessionUserId.length > 0)
				{
					 userId11 = getsessionUserId[0].hostId;
					//userId=	getsessionUserId[0].hostId;				
				}else{
					userId11 = req.currentUser.id
				}

				let sessionUpdt123 = await sessionModel.updateSessionHostBySessId(sessionId,userId11);

					
				//console.log('--------equipment_list-------------',req.body.equipment_list.equipmentList.length)
					if(req.body.equipment_list.equipmentList.length != 0)
					{
						console.log('--------equipment_list-------------',req.body.equipment_list.equipmentList)

						let sessionEquipdeleteresult = await SessionEquipmentMappingModel.updateSessionEquipment(sessionId);
						let equipmentList=[];
						equipmentList=req.body.equipment_list.equipmentList;
	
					//	console.log('----------equipment_list------------------',equipmentList)
	
						 let sessionEquipData;
	
						 for(let i in equipmentList){
							sessionEquipData = [[sessionId,equipmentList[i].id,equipmentList[i].Quantity,equipmentList[i].Link]]
						//	console.log('----------sessionEquipData------------------',sessionEquipData)
	
						let sessionEquipresult = await SessionEquipmentMappingModel.addSessionEquipment(sessionEquipData);
						
						 }
	
	
					}
	
					//console.log('----------shopping_list------------------',req.body.shopping_list.shoppingList)
	
					if(req.body.shopping_list.shoppingList.length != 0)
					{
						let sessionshopdeleteresult = await SessionShoppingListModel.updateSessionshoppingList(sessionId);
						let shoppingList=[];
						shoppingList=req.body.shopping_list.shoppingList;
	
						console.log('----------shoppingList------------------',shoppingList)
	
						 let sessionshopData;
	
						 for(let i in shoppingList){
							sessionshopData = [[sessionId,shoppingList[i].id,shoppingList[i].Quantity,shoppingList[i].itemNote,shoppingList[i].Link]]
							//console.log('----------sessionshopData------------------',sessionshopData)
	
						let sessionshopresult = await SessionShoppingListModel.addSessionshoppingList(sessionshopData);
						//console.log('-------session shopping data will be inserted-------')
						 }
	
					
					}
	
	
					if(false === isEmpty(req.body.activities)){

												
						let activities = req.body.activities;
	
						//console.log('----------activities------------------',activities)

					let sessionScriptId= await sessionScriptMappingModel.getsessionScriptId(sessionId);

					//console.log('---------sessionScriptId-------------',sessionScriptId)

						for(let n in sessionScriptId)
						{

							let updateSessionScript= await sessionScriptModel.updateSessionScript(sessionScriptId[n].sessionScriptId);

							let updateSessionScript_attr= await scriptAttributesModel.updateScriptAttribute(sessionScriptId[n].sessionScriptId);
						}

						let updatesessionScript= await sessionScriptMappingModel.updateSessionScriptMapping(sessionId);

						let counter12 = 1;
	
						for(let i in activities){
	
							var attributes = [];
	
							let sessionScriptInsertData = {	
												interestId : 2,			
												name : activities[i].name,
												description : '',
												userId : userId11,
												//userId : 11,
											}
	
							 // insert into session_script table
							let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);
	
							 // insert into session_script_mapping table
							sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});
	
							let activityAttributes = activities[i].attributes;
							for(let j in activityAttributes){
	
								var attributesArr = [];
	
								attributesArr.push(sessionScriptId);
								attributesArr.push(activities[i].attributes[j].attrKey);
								attributesArr.push(activities[i].attributes[j].attrValue);
								attributesArr.push(1);
								//attributesArr.push(activities[i].attributes[j].orderNo);
								attributesArr.push(counter12);	
								attributes.push(attributesArr);
							}
	
							let scriptAttributeId = await scriptAttributesModel.add(attributes);
							counter12++;
						}
					}else{

						let msg2="Please select at list One Script!";
		
						response.resp(res, 417, msg2)
	
					}
	
						
					response.resp(res, 200, {message:"success"})
				} else {
					//response.resp(res, 400, {message:"Something went wrong."})

					response.resp(res, 417, sessionId)
				} 
	
	
			 //response.resp(res, 200, {output})

				}else {
					//errM
					//let sessNam=getSessionAtTime[k].scheduleDate;
					let msg="You have an already a session";
					response.resp(res, 417, errM)
				}		 
			}else {
				let msg="Please field at list one field!";
				response.resp(res, 417, msg)
			}
	
			} catch(exception) {
					response.resp(res, 500, exception);
				}
			}
	



		async verifyUser(req, res) {
			try {

				//console.log('-------lalit------------',req.body)
	
	
				let decoded_sessid = await utils.encodedDecodedString(req.body.sessId,1);
		
				 let sessdta = decoded_sessid.split("#");
	
	
				 let sessionId= sessdta[0]-100;
	

				 let sessionDta = await sessionModel.findSessionDetailBySessId(sessionId);
					
				//console.log('------sessionDta1111---------',sessionDta)
	
				response.resp(res, 200, {sessionDta})
			} catch(exception) {
				response.resp(res, 500, exception);
			}
		}

		async createWineSession(req, res) {
			try {
				let userId=req.currentUser.id;
				let date11111= new Date();
				let time = date11111.getTime();
			//	console.log('----------req.bodylalit111------------------',req.body)
	
			//	let sessionDetail = await sessionModel.getSession();
				//console.log('----------sessionDetail1------------------',sessionDetail)
			
				//console.log('----------time------------------',time)
			
				let channelId=userId+time;
				let rtmChannelId=userId+1+time;
				
				let date_ob = new Date(req.body.session.start_date);

				//console.log('----------date_ob------------------',date_ob)
				
				let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);
	
				let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
	

				let sessionEndTimeinMinutes=date_ob.setMinutes(date_ob.getMinutes() + req.body.session.duration );
			
				let sessionEndTime = new Date(sessionEndTimeinMinutes);
	
				console.log('------sessionEndTime--------',sessionEndTime)
	
	
				let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
				let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
				let year1 = sessionEndTime.getFullYear();
				let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
				let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
				let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);
	
	
				let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;
	
				console.log('------endDate--------',endDate)


				let hostReminder ='';
				let participantsReminder='';
				let cutOffTime='';
				let minNotMetNoticeTime='';
	
				if(false === isEmpty(req.body.reminder)){
					hostReminder = req.body.reminder.host_reminder ? req.body.reminder.host_reminder :null;
					participantsReminder = req.body.reminder.participants_reminder ? req.body.reminder.participants_reminder : null;
					cutOffTime = req.body.reminder.cutoff_date_time ? req.body.reminder.cutoff_date_time :null;
					minNotMetNoticeTime = req.body.reminder.min_participants_not_met ? req.body.reminder.min_participants_not_met : null;
				}else{
				
					hostReminder = null;
					participantsReminder = null;
					cutOffTime =null;
					minNotMetNoticeTime = null;
				}

				let insertData = {		
					interestId :1,
					isTutorialRead : 0,
					//isDefaultSession : 0,
					isTutorialStart:0,
					groupId : req.body.session.groupId ? req.body.session.groupId : 0,
					sessionChannelId : req.body.session.sessionChannelId ? req.body.session.sessionChannelId : 0,
					channelId : channelId,
					rtmChannelId : rtmChannelId,
					name : req.body.session.name,
					description : req.body.session.description,
					hostId : userId,
					scheduleDate : currentDate,
					duration : req.body.session.duration,
					sessionEndDate:endDate,
					level : req.body.session.level,
					//level : "2",
					minAttendee : req.body.session.min_participants,
					maxAttendee : req.body.session.max_participants, 
					currency : 'USD',
					chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
					sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
					//showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
					showParticipantsCount : req.body.session.searchParticipant == true ? 1 : 0,
					sessionProperty : req.body.session.sessionProperty == true ? 1 : 0,					
					onDemand : req.body.session.onDemand == true ? 1 : 0,
					orderWine : req.body.session.orderWine == true ? 1 : 0,
					hostReminder : hostReminder,
					participantReminder : participantsReminder,
					cutOffTime : cutOffTime,
					minNotMetNoticeTime : minNotMetNoticeTime,
					participantDisableDM : req.body.privacy.allow_participants_disable_dm == true ? 1 : 0,
					participantsPickPlaylist : req.body.privacy.allow_participants_pick_playlist == true ? 1 : 0,
					showParticipantsPicToOtherPartcipants : req.body.privacy.show_part_pic_to_other_part == true ? 1 : 0,
					allowGroupLocation : req.body.groups.allow_group_location == true ? 1 : 0,
					activity : req.body.script.next_activity,
					heartRateMonitor : req.body.script.heart_rate_monitor == true ? 1 : 0,
					zoneTracking : req.body.script.zone_tracking == true ? 1 : 0
				};
	
				//console.log('----------insertData------------------',insertData)
	
				
	
				// // insert into sessions table

				 let sessionId = await sessionModel.add(insertData);
	
				//console.log('----------sessionId1111------------------',sessionId)
	
				if(sessionId > 0){
	
	
					//console.log('----------insertData11111------------------',sessionId)
	
					//let userId=11;
					
					
					let sessionUserId;
	
					// sessionUserId = await sessionUserModel.addSessionUser(sessionId,userId);
	
					 
				
						let c1=2;
						let c2=3;
	
						let dataval = [
							[ sessionId, c1],
							[ sessionId, c2],            
						];
				
						//console.log('----------dataval------------------',dataval)
	
					let sessionconfig = await sessionConfigMappingModel.addSessionConfig(dataval);
	
					//console.log('----------sessionId5555------------------',req.body.host_list.hostList.length)
	
					if(req.body.host_list.hostList.length != 0)
					{
						let hostlist=[];
						 hostlist=req.body.host_list.hostList;					 
	
						 let sessionUserData;
	
						 for(let i in hostlist){
							let pm = await sessionModel.isMember(sessionId,hostlist[i]);
							let pmv=pm.length>0?1:0;
							sessionUserData = [[sessionId,hostlist[i],1,1,1,pmv]]
							//console.log('----------sessionId23333------------------',sessionUserData)
					
						let sessionUserUpdated = await sessionUserModel.updatedSessionhost(sessionId);
						let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
					

						// if(hostlist[i] != userId){
						// 	let sessionUserUpdated = await sessionUserModel.updatedSessionhost(sessionId);
						// let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
						// }
	
						 }
	
	
					}
	
					
	
					if(req.body.equipment_list.equipmentList.length != 0)
					{
						let equipmentList=[];
						equipmentList=req.body.equipment_list.equipmentList;
	
						//console.log('----------equipment_list------------------',equipmentList)
	
						 let sessionEquipData;
	
						 for(let i in equipmentList){
							sessionEquipData = [[sessionId,equipmentList[i].id,equipmentList[i].Quantity,equipmentList[i].Link]]
						//	console.log('----------sessionEquipData------------------',sessionEquipData)
	
						let sessionEquipresult = await SessionEquipmentMappingModel.addSessionEquipment(sessionEquipData);
						
						 }
	
	
					}
	
				//	console.log('----------shopping_list------------------',req.body.shopping_list.shoppingList)
	
					if(req.body.shopping_list.shoppingList.length != 0)
					{
						let shoppingList=[];
						shoppingList=req.body.shopping_list.shoppingList;
	
						//console.log('----------shoppingList------------------',shoppingList)
	
						 let sessionshopData;
	
						 for(let i in shoppingList){
							sessionshopData = [[sessionId,shoppingList[i].id,shoppingList[i].Quantity,shoppingList[i].itemNote,shoppingList[i].Link]]
							//console.log('----------sessionshopData------------------',sessionshopData)
	
						let sessionshopresult = await SessionShoppingListModel.addSessionshoppingList(sessionshopData);
						//console.log('-------session shopping data will be inserted-------')
						 }
	
	
					}
	//console.log('------req.body.activities--------',req.body.activities);
	
					if(false === isEmpty(req.body.activities)){
						
						let activities = req.body.activities;
	
						//console.log('----------activities------------------',activities)
	
						for(let i in activities){
	
							var attributes = [];
	
							let sessionScriptInsertData = {	
												interestId : 1,			
												name : activities[i].wineChoice,
												description : '',
												userId : req.currentUser.id,
												//userId : 11,
											}
	
							 // insert into session_script table
							let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);
	
							 // insert into session_script_mapping table
							sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});

							//console.log('------activities[i].attributes----------',activities[i])

								
							let activityEmojies = activities[i].Emojies;
							//console.log('---------activityEmojies-----------------',activityEmojies);
							for(let j in activityEmojies){
								//console.log('---------activityEmojies[j].id-----------------',activityEmojies[j].id);
								//console.log('---------activityEmojies[j].type-----------------',activityEmojies[j].type);
								var emojiesArr = [];
								emojiesArr.push(sessionId);
								emojiesArr.push(sessionScriptId);							
								emojiesArr.push(activityEmojies[j].id);
								emojiesArr.push(activityEmojies[j].emojies_type);
								emojiesArr.push(1);									
								//console.log('---------emojiesArr-----------------',emojiesArr);
							let emojiesArrr=[emojiesArr];
							let sessionEmojiesdata = SessionEmojiesModel.addSessionEmojies(emojiesArrr);
							}							
							
						}
					}
	

					let sessId=sessionId+100;
					let optcode=sessId+'#'+'virdio';
	
					let resultant_code = await utils.encodedDecodedString(optcode,0);
	
	
					let urlcode=process.env.DOMAIN_URL_FOR_USER+"/"+resultant_code;
	
								
				let sessionDt = await sessionModel.findSessionDetailBySessId(sessionId);
	
				//console.log('------sessionDt-----------',sessionDt)


				let encodeEmail=sessionDt.email+'#'+sessionDt.firstName;
				let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
				//console.log('-----------encoded_email-----------',encoded_email)
	
					let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"><div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 22px; margin-bottom: 30px;">Hi '+sessionDt.firstName+', congratulations on creating for your first Virdio Session. Lets make sure everything works well on your primary device by clicking on the "Lets Setup Your Device" link below</p><p class="button_cont" style="padding-top: 60px; padding-bottom: 60px; text-align: center;"><a href="'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'" class="button1" style="padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 18px; text-decoration: none !important;">Lets Setup Your Device</a></p></div><p style="text-align: center; color: white; font-size: 22px; margin-bottom: 10px;">If the above link is not working, then copy and paste the following URL in the browser address bar</p><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="" style="color: white; text-decoration: none;">'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div></body>';				
				
					//console.log('-------html--------',html)
	
				let to=sessionDt.email;
		let subject='Virdio Onboarding – Open Email on device you plan to host the session on.';
				let text='Please Check ur Mail';
	
				let sendmail = await SendMail.emailInput(to,subject,html);

	
					response.resp(res, 200, {urlcode,sessionDt})

					// res.status(200).send({logId : insertedId});
					//response.resp(res, 200, {})
				} else {
					//response.resp(res, 500, {message:"Something went wrong."})
					response.resp(res, 417, sessionId)
				} 
	
	
	
	
			} catch(exception) {
					response.resp(res, 500, exception);
				}
			}


			async editwineSession(req, res) {
				try {
					let userId=req.currentUser.id;
					let sessionId=req.params.sessionId;
				//	console.log('----------req.bodylalit111------------------',req.body)

					let sessionDetail = await sessionModel.findSessionDetailBySessId(sessionId);
					
					let channelId=sessionDetail.channelId;
					let rtmChannelId=sessionDetail.rtmChannelId;
					
				let date_ob = new Date(req.body.session.start_date);

				console.log('----------date_ob------------------',date_ob)
				
				let date = ("0" + date_ob.getDate()).slice(-2);
				let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
				let year = date_ob.getFullYear();
				let hours = ("0" + date_ob.getHours()).slice(-2);
				let minutes = ("0" + date_ob.getMinutes()).slice(-2);
				let seconds = ("0" + date_ob.getSeconds()).slice(-2);
	
				let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
		


				let sessionEndTimeinMinutes=date_ob.setMinutes(date_ob.getMinutes() + req.body.session.duration );
			
				let sessionEndTime = new Date(sessionEndTimeinMinutes);
	
				console.log('------sessionEndTime--------',sessionEndTime)
	
	
				let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
				let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
				let year1 = sessionEndTime.getFullYear();
				let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
				let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
				let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);
	
	
				let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;
	
				console.log('------endDate--------',endDate)

				let hostReminder ='';
				let participantsReminder='';
				let cutOffTime='';
				let minNotMetNoticeTime='';
	
				if(false === isEmpty(req.body.reminder)){
					hostReminder = req.body.reminder.host_reminder ? req.body.reminder.host_reminder :null;
					participantsReminder = req.body.reminder.participants_reminder ? req.body.reminder.participants_reminder : null;
					cutOffTime = req.body.reminder.cutoff_date_time ? req.body.reminder.cutoff_date_time :null;
					minNotMetNoticeTime = req.body.reminder.min_participants_not_met ? req.body.reminder.min_participants_not_met : null;
				}else{
				
					hostReminder = null;
					participantsReminder = null;
					cutOffTime =null;
					minNotMetNoticeTime = null;
				}
					let insertData = {	
						interestId : 1,
						groupId : req.body.session.groupId ? req.body.session.groupId : 0,
						sessionChannelId : req.body.session.sessionChannelId ? req.body.session.sessionChannelId : 0,
						channelId : channelId,
						rtmChannelId : rtmChannelId,
						name : req.body.session.name,
						description : req.body.session.description,
						hostId : userId,
						scheduleDate : currentDate,
						duration : req.body.session.duration,
						sessionEndDate:endDate,
						level : req.body.session.level,
						minAttendee : req.body.session.min_participants,
						maxAttendee : req.body.session.max_participants, 
						currency : 'USD',
						chargeForSession  : req.body.session.amountCharge ? req.body.session.amountCharge : 0,
						sessionChargeAllowed  : req.body.session.session_charge == true ? 1 : 0,
						//showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
						showParticipantsCount : req.body.session.searchParticipant == true ? 1 : 0,
						sessionProperty : req.body.session.sessionProperty == true ? 1 : 0,					
						onDemand : req.body.session.onDemand == true ? 1 : 0,
						orderWine : req.body.session.orderWine == true ? 1 : 0,
						hostReminder : hostReminder,
						participantReminder : participantsReminder,
						cutOffTime : cutOffTime,
						minNotMetNoticeTime : minNotMetNoticeTime,
						participantDisableDM : req.body.privacy.allow_participants_disable_dm == true ? 1 : 0,
						participantsPickPlaylist : req.body.privacy.allow_participants_pick_playlist == true ? 1 : 0,
						showParticipantsPicToOtherPartcipants : req.body.privacy.show_part_pic_to_other_part == true ? 1 : 0,
						allowGroupLocation : req.body.groups.allow_group_location == true ? 1 : 0,
						activity : req.body.script.next_activity,
						heartRateMonitor : req.body.script.heart_rate_monitor == true ? 1 : 0,
						zoneTracking : req.body.script.zone_tracking == true ? 1 : 0
					};
		
					//console.log('----------insertData------------------',insertData)
				
					// // insert into sessions table
	
					let output = await sessionModel.updateSession(insertData,sessionId);
		
					//console.log('----------sessionId1111------------------',sessionId)
		
					if(output > 0){
		
		
						//console.log('----------insertData11111------------------',output)
		
						//let userId=11;
						
						
						// let sessionUserId;
		
						//  sessionUserId = await sessionUserModel.addSessionUser(sessionId,userId);
		
						 
					
						// 	let c1=2;
						// 	let c2=3;
		
						// 	let dataval = [
						// 		[ sessionId, c1],
						// 		[ sessionId, c2],            
						// 	];
					
						// 	console.log('----------dataval------------------',dataval)
		
						// let sessionconfig = await sessionConfigMappingModel.addSessionConfig(dataval);
		
						//console.log('----------sessionId5555------------------',req.body.host_list.hostList.length)

		
						if(req.body.host_list.hostList.length != 0)
						{
							let sessionUserresult = await sessionUserModel.updateSessionAnotherhost(sessionId);
							let hostlist=[];
							 hostlist=req.body.host_list.hostList;					 
		
							 let sessionUserData;
		
							 for(let i in hostlist){
								let pm = await sessionModel.isMember(sessionId,hostlist[i]);
								let pmv=pm.length>0?1:0;

								sessionUserData = [[sessionId,hostlist[i],1,1,1,pmv]]
								//console.log('----------sessionId23333------------------',sessionUserData)

							let sessionUserUpdated = await sessionUserModel.updatedSessionhost(sessionId);
							let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
								

								// if(hostlist[i] != userId){
								// 	let sessionUserUpdated = await sessionUserModel.updatedSessionhost(sessionId);
								// let sessionUserresult = await sessionUserModel.addSessionAnotherhost(sessionUserData);
								// }
		
							 }
		
		
						}
		
						
		
						if(req.body.equipment_list.equipmentList.length != 0)
						{
							let sessionEquipdeleteresult = await SessionEquipmentMappingModel.updateSessionEquipment(sessionId);
							let equipmentList=[];
							equipmentList=req.body.equipment_list.equipmentList;
		
							//console.log('----------equipment_list------------------',equipmentList)
		
							 let sessionEquipData;
		
							 for(let i in equipmentList){
								sessionEquipData = [[sessionId,equipmentList[i].id,equipmentList[i].Quantity,equipmentList[i].Link]]
								//console.log('----------sessionEquipData------------------',sessionEquipData)
		
							let sessionEquipresult = await SessionEquipmentMappingModel.addSessionEquipment(sessionEquipData);
							
							 }
		
		
						}
		
					//	console.log('----------shopping_list------------------',req.body.shopping_list.shoppingList)
		
						if(req.body.shopping_list.shoppingList.length != 0)
						{
							let sessionshopdeleteresult = await SessionShoppingListModel.updateSessionshoppingList(sessionId);
							let shoppingList=[];
							shoppingList=req.body.shopping_list.shoppingList;
		
							//console.log('----------shoppingList------------------',shoppingList)
		
							 let sessionshopData;
		
							 for(let i in shoppingList){
								sessionshopData = [[sessionId,shoppingList[i].id,shoppingList[i].Quantity,shoppingList[i].itemNote,shoppingList[i].Link]]
							//	console.log('----------sessionshopData------------------',sessionshopData)
		
							let sessionshopresult = await SessionShoppingListModel.addSessionshoppingList(sessionshopData);
						//	console.log('-------session shopping data will be inserted-------')
							 }
		
		
						}
		//console.log('------req.body.activities--------',req.body.activities);
		
						if(false === isEmpty(req.body.activities)){


							let sessionScriptId= await sessionScriptMappingModel.getsessionScriptId(sessionId);

							//console.log('---------sessionScriptId-------------',sessionScriptId)

							let updateSessionEmojiesdata= await SessionEmojiesModel.updateSessionEmojies(sessionId);

						for(let n in sessionScriptId)
						{

							let updateSessionScript= await sessionScriptModel.updateSessionScript(sessionScriptId[n].sessionScriptId);
							
						}

						let updatesessionScript= await sessionScriptMappingModel.updateSessionScriptMapping(sessionId);
							
							let activities = req.body.activities;
		
							//console.log('----------activities------------------',activities)
		
							for(let i in activities){
		
								var attributes = [];
		
								let sessionScriptInsertData = {	
													interestId : 1,			
													name : activities[i].wineChoice,
													description : '',
													userId : req.currentUser.id,
													//userId : 11,
												}
		
								 // insert into session_script table
								let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);
		
								 // insert into session_script_mapping table
								sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});
	
							//	console.log('------activities[i].attributes----------',activities[i])
	
									
								let activityEmojies = activities[i].Emojies;
								//console.log('---------activityEmojies-----------------',activityEmojies);
								for(let j in activityEmojies){
									console.log('---------activityEmojies[j].id-----------------',activityEmojies[j].id);
									console.log('---------activityEmojies[j].type-----------------',activityEmojies[j].type);
									var emojiesArr = [];
									emojiesArr.push(sessionId);
									emojiesArr.push(sessionScriptId);							
									emojiesArr.push(activityEmojies[j].id);
									emojiesArr.push(activityEmojies[j].emojies_type);
									emojiesArr.push(1);									
								//	console.log('---------emojiesArr-----------------',emojiesArr);
								let emojiesArrr=[emojiesArr];
								let sessionEmojiesdata = SessionEmojiesModel.addSessionEmojies(emojiesArrr);
								}							
								
							}
						}
		
	
					// 	console.log('----------scriptAttributeId------------------',sessionId)
					// 	let sessId=sessionId+100;
					// 	let optcode=sessId+'#'+'virdio';
		
					// 	console.log('----------script------------------',optcode)
					// 	let resultant_code = await utils.encodedDecodedString(optcode,0);
		
					// 	console.log('-------resultant_code--------',resultant_code)
		
					// 	let urlcode=process.env.DOMAIN_URL_FOR_USER+"/"+resultant_code;
		
					// 	console.log('-------urlcode--------',urlcode)
									
					// let sessionDt = await sessionModel.findSessionDetailBySessId(sessionId);
		
					// console.log('------sessionDt-----------',sessionDt)

		
						response.resp(res, 200, {message:"Wine session edited successFully"})
	
						// res.status(200).send({logId : insertedId});
						//response.resp(res, 200, {})
					} else {
						//response.resp(res, 500, {message:"Something went wrong."})
						response.resp(res, 417, sessionId)
					} 
				
		
				} catch(exception) {
						response.resp(res, 500, exception);
					}
				}
	
					

	async getSessionDetail1(req, res) {
	    try {
			//let user_id=11;
			let user_id=req.currentUser.id;
			//console.log('------userid-----------',user_id)
			let sessionObj = await sessionModel.findSessionDetail1(req.params.sessionId, user_id);

			//console.log('sessionObj ====munmun=========== ',sessionObj);
			
			// if(true !== underscore.isEmpty(sessionObj)){
			// 	let token = clientToken.createToken(sessionObj.appId, sessionObj.appCertificate, sessionObj.channelId, sessionObj.userId);
			// 	sessionObj = underscore.extend(sessionObj, {token : token});
			// 	sessionObj = underscore.omit(sessionObj, 'appCertificate');
			// }

			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	async getAllProductByHost(req, res) {
	    try {
			
			//console.log('------userid-----------',req.params.userId)
			let sessionObj = await sessionModel.findAllProductByHost(req.params.userId);

			response.resp(res, 200, sessionObj)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}


	
	async checkDuplicateSession(req, res) {
	    try {
	    	let sessionName = req.params.sessionName;

			let sessionObj = await sessionModel.checkDuplicateSession(req.currentUser.id, sessionName);

			if (isEmpty(sessionObj)) {
				response.resp(res, 200, sessionObj);
			} else {
				response.resp(res, 500, {message:"Session name already exists"})
			}		
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getHosts(req, res) {
	    try {

			//let userId=11;
			//let userId=req.currentUser.id;
			console.log('------lalitgethost---------',req.params.channelId)
			
			let hostsList = await channelHostModel.getChannelHostsList1(req.params.channelId);

			//console.log('------lalitgethostlist---------',hostsList)

			response.resp(res, 200, hostsList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getHostsForChannel(req, res) {
	    try {

		//	let userId=11;
			let userId=req.currentUser.id;
			//console.log('------lalitgethost---------',req.param)
			let hostsList = await userModel.getUserById(userId);
			//let hostsList = await channelHostModel.getChannelHostsList(req.params.channelId,userId);

			//console.log('------lalitgethostlist---------',hostsList)

			response.resp(res, 200, hostsList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getEquipments(req, res) {
	    try {
			//console.log('------getEquipments---------',req.params.interestId)
			let equipmentList = await InterestEquipmentModel.getEquipments(req.params.interestId);

			//console.log('------lalitgetequipment---------',equipmentList)

			response.resp(res, 200, equipmentList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getShoppingList(req, res) {
	    try {
			//console.log('------getShopping---------',req.params.interestId)
			
			let shopping_List = await InterestShoppingModel.getInterestShoppingList(req.params.interestId);

			//console.log('------lalitgetshopping---------',shopping_List)

			response.resp(res, 200, shopping_List);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getActivityType(req, res) {
	    try {
			//console.log('------getActivityType---------',req.params.interestId)
			
			let activity_List = await ActivityTypeModel.getActivityType(req.params.interestId);

			//console.log('------lalitgetactivity---------',activity_List)

			response.resp(res, 200, activity_List);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getEmojiesList(req, res) {
	    try {
			//console.log('------Emojies---------',req.params.interestId)
			
			let emojiesList = await EmojiesModel.getEmojies(req.params.interestId);

			response.resp(res, 200, emojiesList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getProductList(req, res) {
	    try {
			//console.log('------getProductList---------',req.params.channelId)
			
			let productList = await ChannelProductModel.getproductsByChannel(req.params.channelId);

			//console.log('------productList---------',productList)

			response.resp(res, 200, productList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getAttributeList(req, res) {
	    try {
			//let inerestId = 1;
			//console.log('------getAttributeList---------',req.params.interestId)
			
			let attributeList = await scriptAttributesModel.getAttributesByInterestIds(req.params.interestId);

			//console.log('------getAttributeList---------',attributeList)

			response.resp(res, 200, attributeList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async addNewProduct(req, res) {
	    try {
			//let inerestId = 1;
			//console.log('------addNewProduct---------',req.body)
			
			if(false === isEmpty(req.body)){
					
				let newproducts = req.body.saveProduct;

			//	console.log('----------products------------------',newproducts)

			//	for(let i in newproducts){

					//var newproducts = [];
					var attributesnewArr = [];

					let sessionScriptInsertData = {	
										interestId : 1,			
										name : newproducts.name,
										description : '',
										userId : req.currentUser.id,
										//userId : 11,
									}
		//console.log('----------sessionScriptInsertData------------------',sessionScriptInsertData)
					 // insert into session_script table
					let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);


					let productsAttributes = newproducts.attributes;
					for(let j in productsAttributes){

						var attributesArr = [];

						attributesArr.push(sessionScriptId);
						attributesArr.push(newproducts.attributes[j].attrKey);
						attributesArr.push(newproducts.attributes[j].attrValue);
						attributesArr.push(1);
						attributesArr.push(2);
						
						//console.log('----------attributesArr------------------',attributesArr)

						attributesnewArr.push(attributesArr);

						//console.log('----------attributesnewArr------------------',attributesnewArr)

					}

					var scriptAttributeres = await scriptAttributesModel.add(attributesnewArr);

					//console.log('------scriptAttributeres---------',scriptAttributeres)
			
			}

		
			response.resp(res, 200, scriptAttributeres);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	
	// async getInterestBychannelId(req, res) {
	//     try {
	// 		//let inerestId = 1;
	// 		console.log('------channelId---------',req.params.channelId)
			
	// 		let interestList = await ChannelInterestModel.getInterestBychannel(req.params.channelId);

	// 		console.log('------interestList---------',interestList)

	// 		response.resp(res, 200, interestList);
	//     } catch(exception) {
	// 		response.resp(res, 500, exception);
	//     }
	// }


	async getInterest(req, res) {
	    try {
			//let inerestId = 1;
						
			let interestList = await ChannelInterestModel.getInterestforaChannel(req.params.channelId);

			//console.log('------interestList---------',interestList)

			response.resp(res, 200, interestList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async getSessionListByInterestId(req, res) {
	    try {
			//let inerestId = 1;
						
		let sessionList = await sessionModel.getNextSessionByInterestId(req.params.interestId);

			//console.log('------sessionList---------',sessionList)

			response.resp(res, 200, sessionList);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getchannelListByHost(req, res) {
	    try {
			//let inerestId = 1;
			let user_id=req.currentUser.id;
			//let user_id=75;		
			//console.log('--------user_id----------')	
			 let channelList = await ChannelsModel.getChannelList(user_id);

			//console.log('------channelList---------',channelList)
			let newArr=[];
			for(let i in channelList)
			{
				let attrData= channelList[i];

				console.log('-----attrData----------',attrData)

				let type1="upComingSession";
				
				let channelUpcommingSession = await sessionModel.getTotalSession(attrData.id,type1);
				let channelUpcommingDefaultSession = await sessionModel.getTotalDefaultSession(attrData.id,type1);
				console.log('----------channelUpcommingDefaultSession-----------',channelUpcommingDefaultSession)
				//console.log('----------channelUpcommingSessionlength-----------',channelUpcommingSession.length)
				let totLength =channelUpcommingSession.length + channelUpcommingDefaultSession.length;
				//underscore.extend(attrData, {totalUpcomming : channelUpcommingSession.length});
				underscore.extend(attrData, {totalUpcomming : totLength});
				if(channelUpcommingSession.length > 0){
				underscore.extend(attrData, {nextSession : channelUpcommingSession[0].userName});
				}else{
					underscore.extend(attrData, {nextSession : ''});
				}
				
				
				let type2="pastSession";
				let channelPastSession = await sessionModel.getTotalSession(attrData.id,type2);

				let channelPastDefaultSession = await sessionModel.getTotalDefaultSession(attrData.id,type2);
				let totPastLength =channelPastSession.total + channelPastDefaultSession.total;
				//console.log('----------channelPastSession-----------',channelPastSession)
				//underscore.extend(attrData, {totalPast : channelPastSession.total});
				underscore.extend(attrData, {totalPast : totPastLength});
				let channelHostList = await channelHostModel.getChanneHostList(attrData.id,attrData.userId);

			let newArr1=[];
				for(let j in channelHostList)
				{
					let attrData1= channelHostList[j];
					//console.log('----------------attrData1------------------',attrData1)
					let nextSessionList = await sessionModel.getNextSessionByHostId(channelHostList[j].id,attrData.id);
					//console.log('--------nextSessionList-----------',nextSessionList)
					underscore.extend(attrData1, {sessionList : nextSessionList});
					newArr1.push(attrData1);
				}
				underscore.extend(attrData, {channelHost : newArr1});
				let channelInterestList = await ChannelInterestModel.getChanneInterestlList(attrData.id);


			//	console.log('--------channelInterestList--------',channelInterestList)
				let newArr2=[];
				for(let k in channelInterestList)
				{
					let attrData2= channelInterestList[k];
					let nextSessionListByInterest = await sessionModel.getNextSessionByInterestId(channelInterestList[k].id,attrData.id);
					//console.log('--------nextSessionListByInterest-----------',nextSessionListByInterest)
					underscore.extend(attrData2, {sessionList : nextSessionListByInterest});

					newArr2.push(attrData2);
				}
				//console.log('--------newArr2--------',newArr2)
				//underscore.extend(attrData, {channelHost : channelHostList});
				
				underscore.extend(attrData, {channelInterest : newArr2});
				//underscore.extend(attrData, {channelInterest : channelInterestList});
				newArr.push(attrData);
			}

	
			response.resp(res, 200, newArr);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}




	async getIndividualChanneldetails(req, res) {
	    try {
		
			//console.log('--------user_id----------')	
			 let channelDetail = await ChannelsModel.getChannelDetails(req.params.channelId,req.currentUser.id);

			//console.log('------channelDetail---------',channelDetail)
			if(!isEmpty(channelDetail)){
			let channelHostList = await channelHostModel.getChanneHostList(req.params.channelId,req.currentUser.id);
			//console.log('------channelHostList---------',channelHostList)
			if(!isEmpty(channelHostList)){
			underscore.extend(channelDetail, {channelHost : channelHostList});
			}else{
				underscore.extend(channelDetail, {channelHost : []});
			}
			let channelInterestList = await ChannelInterestModel.getChanneInterestlList(req.params.channelId);

			//console.log('------channelInterestList---------',channelInterestList)
			if(!isEmpty(channelInterestList)){
			underscore.extend(channelDetail, {channelInterest : channelInterestList});
			}else{
				underscore.extend(channelDetail, {channelInterest : []});
			}
			}else{
				let channelDetail=[];
			}
			response.resp(res, 200, channelDetail);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async createNewChannel(req, res) {
	    try {		
			//let user_id=73;
			
			let user_id=req.currentUser.id;
			console.log('-------req.body111111111------------',req.body)

			let channelData = await ChannelsModel.checkChannelList(user_id);

			//console.log('-------channelData--------',channelData.length)

			if(channelData.length > 0)
			{
				let msg= "you have already a channel";
				response.resp(res, 417, msg)
			}else
				{

			if(false === isEmpty(req.body)){

				let cname=req.body.channel.name.trim();
				let Cdescription=req.body.channel.description.trim();
				let Cphone=req.body.channel.phone.trim();
				let City=req.body.channel.city.trim();
				let streetAdd1=req.body.channel.street_address1.trim();
				let streetAdd2=req.body.channel.street_address2.trim();
				let zipCode=req.body.channel.zip_code.trim();

			let insertData = {		
				name : cname,
				description : Cdescription,
				individualOrBusiness : req.body.channel.chType ? req.body.channel.chType : 0,
				groupId : req.body.channel.groupId ? req.body.channel.groupId : 0,
				image : req.body.channel.image ? req.body.channel.image :"default.png",
				//image : "default.png",
				userId:user_id,
				phone : Cphone ? Cphone : "",
				//level : "2",
				street_address1 : streetAdd1 ? streetAdd1 : "",
				street_address2 : streetAdd2 ? streetAdd2 : "", 
				charge_amount  : req.body.channel.charge_amount ? req.body.channel.charge_amount : 0,
				chargeForSession  : req.body.channel.chargeForSession == true ? 1 : 0,
				city : City ? City : "",
				country_code : req.body.channel.country_code ? req.body.channel.country_code : "",
				state_code : req.body.channel.state_code ? req.body.channel.state_code : "",
				zip_code : zipCode ? zipCode : "",
				account_name : req.body.channel.account_name,
				account_number : req.body.channel.account_number,
				account_type : req.body.channel.account_type,
				routing_number : req.body.channel.routing_number,
				ss : req.body.channel.ss ? req.body.channel.ss : 0,
				ein : req.body.channel.ein ? req.body.channel.ein : 0,
				has_shopping_list : req.body.channel.has_shopping_list == true ? 1 : 0,
				has_equipment_list : req.body.channel.has_equipment_list == true ? 1 : 0,
				has_product_list : req.body.channel.has_product_list == true ? 1 : 0
			};

			//console.log('----------insertData------------------',insertData)

			
			// insert into sessions table
			var channelId = await ChannelsModel.addchannel(insertData);

			console.log('----------insertData1111------------------',channelId)

			if(channelId > 0)
			{

				if(req.body.channelHost.channel_Host.length != 0)
				{
					let channelhost=req.body.channelHost.channel_Host;
					let hostlist=[];
					 hostlist=channelhost;					 

					 let channelHostData;

					 for(let i in hostlist){
						channelHostData = [[hostlist[i],channelId,user_id]]
					//console.log('----------channelHostData------------------',channelHostData)

					let channelUserRes = await channelHostModel.addChannelHost(channelHostData);
					//console.log('----------channelUserRes------------------',channelUserRes)
					 }


				}

				

				if(req.body.InterestHost.Interest_Host.length != 0)
				{
					let Interesthost=req.body.InterestHost.Interest_Host;
					let interestList=[];
					 interestList=Interesthost;					 

					 let interestListData;

					 for(let i in interestList){
						interestListData = [[channelId,interestList[i]]]
				
			let InterestUserRes = await ChannelInterestModel.addChannelInterest(interestListData);
					 }


				}

			let sessionId=process.env.SESSIONID;
			let tempPath=process.env.APP_URL1+"/api/v1/session/"+sessionId+"/individualsessiondetailForAdmin";
			console.log ("postpath : "+tempPath);
			axios.get(process.env.APP_URL1+"/api/v1/session/"+sessionId+"/individualsessiondetailForAdmin")          
			.then(res => {
			  console.log('---------Interestactivity111111111--------------',res.data);
	  
				let newDta=res.data.responseData.sessionData;
			 
			  axios.post(process.env.APP_URL2+"/api/v1/session/createDefaultSession", {newDta,user_id,channelId})

			  .then(res => {
						
		
				console.log('=============lallittiwari12345===================>',res.data);
			
			  }).catch(err=>{
				console.log('-------------err11111111111111----------------',err)
				console.log('----------!!!!!there is problem to get default session Data!!!------------');
			  })
				 
			})
			.catch(err =>{
				console.log('-------------err22222222222222----------------',err)
				console.log('----------there is problem to create a default session------------');
	  
			});


			let userObj = await userModel.getUserdetailById(user_id);

			if(!isEmpty(userObj)){

			let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 15px 20px 15px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj.firstName+', thank you for signing up to host sessions on Virdio. A few quick tips on getting started on Virdio:</p><ul style="font-size: 22px; color: white; padding-left: 15px;"> <li style="margin: 15px;">On your dashboard on Virdio.com, we have placed an initial session for you use so that you can get familiar with what goes into creating a session.</li><li style="margin: 15px;">When you are ready to get familiar with hosting a session, click on the Join button with this session to start your tutorial. The Virdio tutorial will familiarize you with all the controls used during your session.</li><li style="margin: 15px;">Once you have gone through the tutorial, you can create your own sessions and begin to host them with anyone.</li><li style="margin: 15px;">Finally, here is a <a href="'+process.env.DOCS_PATH+'/docs/help/Host_Guide.pdf" class="mx-2">link</a> to a guide to help you through the process.</li></ul> <p style="font-size: 22px; color: white; margin-bottom: 15px; text-align: center;">The Virdio Team</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
			//console.log('-------html--------',html)

			let to=userObj.email;
			let subject='Welcome to Virdio and a few important tips on getting started!';
			let text='Please Check ur Mail';

			let sendmail = await SendMail.emailInput(to,subject,html);
			
			}
			
		//response.resp(res, 200, {msg:"A mail has been sent to your emailId"})
				
				response.resp(res, 200, channelId);

			}else {
				//response.resp(res, 500, {message:"Something went wrong."})
				response.resp(res, 417, channelId)
			}
	
		}else {
			let msg= "Please Enter Data in InputField";
				response.resp(res, 417, msg)
		}

	}
		//response.resp(res, 200, {"msg":"channel created successfully"});
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async createDefault11Session(req, res) {
	    try {

			console.log('-------11111111111111----------------req.body',req.body)
					
			let sessionDta=req.body.newDta;

			console.log('-------sessionDta----------------req.body',sessionDta)

			let userId=req.body.user_id;
			console.log('-------userId----------------',userId)

			let sessionChannelId1='';
			//let sessionChannelId11='';
			if(true === isEmpty(req.body.channelId)){
			//	if(true === isEmpty(sessionChannelId11)){
				let channelDataId = await ChannelsModel.getChannelId(userId);
				 sessionChannelId1=channelDataId.id;
			}else{
				 sessionChannelId1=req.body.channelId;
			}

		
			console.log('-------sessionChannelId1----------------',sessionChannelId1)

			//let sessionObj = await sessionModel.checkDuplicateSession(userId, sessionDta.name);
			//if(isEmpty(sessionObj)) {
			let date11111= new Date();
			let time = date11111.getTime();
			console.log('-------time----------------',time)
			let channelId=userId+time;
			let rtmChannelId=userId+1+time;

			console.log('---------------------------newsessionDetail',channelId,rtmChannelId)
			
			
			let date_ob11 = new Date();

			let date_ob1=date_ob11.setMinutes(date_ob11.getMinutes() + 3);
			
			let date_ob = new Date(date_ob1);

			//console.log('----------date_ob------------------',date_ob)
	    	
			let date = ("0" + date_ob.getDate()).slice(-2);
			let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	    	let year = date_ob.getFullYear();
			let hours = ("0" + date_ob.getHours()).slice(-2);
			let minutes = ("0" + date_ob.getMinutes()).slice(-2);
			let seconds = ("0" + date_ob.getSeconds()).slice(-2);


			let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

			console.log('------currentDate--------',currentDate)

			let sessionEndTimeinMinutes=date_ob.setMinutes(date_ob.getMinutes() + req.body.newDta.duration );
			
			let sessionEndTime = new Date(sessionEndTimeinMinutes);

			console.log('------sessionEndTime--------',sessionEndTime)


			let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
			let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
	    	let year1 = sessionEndTime.getFullYear();
			let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
			let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
			let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);


			let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;

			console.log('------endDate--------',endDate)

				let hostReminder = req.body.newDta.hostReminder ? req.body.newDta.hostReminder :null;
				let participantsReminder = req.body.newDta.participantReminder ? req.body.newDta.participantReminder : null;
				let cutOffTime = "2019-11-02 15:06:01";
			let minNotMetNoticeTime = req.body.newDta.minNotMetNoticeTime ? req.body.newDta.minNotMetNoticeTime : null;
		
	
			//console.log('------currentDate11111111111111---------',currentDate)

			let insertData = {	
				//interestId : req.body.newDta.interestId ? req.body.session.interestId : 2,
				interestId : 2,
				isTutorialRead : 1,
				//isDefaultSession : 1,
				isTutorialStart:1,
				charges:0,
				timeZone : "America/New_York",
				groupId : sessionDta.groupId ? sessionDta.groupId : 1,
				sessionChannelId : sessionChannelId1 ? sessionChannelId1: 1,	
				channelId : channelId,
				rtmChannelId : rtmChannelId,
				name : sessionDta.name,
				description : sessionDta.description,
				hostId : userId,
				scheduleDate : currentDate,
				duration : sessionDta.duration,
				sessionEndDate:endDate,
				level : sessionDta.level,
				minAttendee : sessionDta.minAttendee,
				maxAttendee : sessionDta.maxAttendee, 
				currency : 'USD',
				chargeForSession  : sessionDta.chargeForSession ? sessionDta.chargeForSession : 0,
				sessionChargeAllowed  : sessionDta.sessionChargeAllowed,
				//showParticipantsCount : req.body.session.show_particpants_count == true ? 1 : 0,
				showParticipantsCount : sessionDta.showParticipantsCount,
				sessionProperty : sessionDta.sessionProperty,
				onDemand : sessionDta.onDemand,
				orderWine : sessionDta.orderWine,
				hostReminder : hostReminder,
				participantReminder : participantsReminder,
				cutOffTime : cutOffTime,
				minNotMetNoticeTime : minNotMetNoticeTime,
				displayScript : 1,
				participantDisableDM : sessionDta.participantDisableDM,
				participantsPickPlaylist : sessionDta.participantsPickPlaylist,
				showParticipantsPicToOtherPartcipants : sessionDta.showParticipantsPicToOtherPartcipants,
				allowGroupLocation : sessionDta.allowGroupLocation,
				activity : sessionDta.activity,
				heartRateMonitor : sessionDta.heartRateMonitor,
				zoneTracking : sessionDta.zoneTracking
			};


			// insert into sessions table
			let sessionId = await sessionModel.add(insertData);

			console.log('----------sessionId1111------------------',sessionId)



			if(sessionId > 0){

					let c1=2;
					let c2=3;

					let dataval = [
						[ sessionId, c1],
						[ sessionId, c2],            
					];
			
				let sessionconfig = await sessionConfigMappingModel.addSessionConfig(dataval);

			let sessionUserId1123 = await sessionUserModel.addSessionUser(sessionId,userId);


				if(false === isEmpty(sessionDta.scriptDetail)){
					
					let activities = sessionDta.scriptDetail;

					let counter12 = 1;
					for(let i in activities){

						var attributes = [];

						let sessionScriptInsertData = {	
											interestId : 2,			
											name : activities[i].name,
											description : '',
											userId : userId,
										}

			 			// insert into session_script table
						let sessionScriptId = await sessionScriptModel.add(sessionScriptInsertData);

			 			// insert into session_script_mapping table
						sessionScriptMappingModel.add({ sessionId: sessionId, sessionScriptId : sessionScriptId});

						let activityAttributes = activities[i].attribute;
						for(let j in activityAttributes){

							var attributesArr = [];
							attributesArr.push(sessionScriptId);
							attributesArr.push(activities[i].attribute[j].attrLabel);
							attributesArr.push(activities[i].attribute[j].attrValue);							
							attributesArr.push(1);
							//attributesArr.push(activities[i].attributes[j].orderNo);
							attributesArr.push(counter12);

							attributes.push(attributesArr);

						}
						let scriptAttributeId = await scriptAttributesModel.add(attributes);

						counter12++;
					}
				}

				let sessId=sessionId+100;
				let optcode=sessId+'#'+'virdio';

				let resultant_code = await utils.encodedDecodedString(optcode,0);


				let urlcode=process.env.DOMAIN_URL_FOR_USER+"/"+resultant_code;

				//console.log('-----urlcode-------',urlcode,sessionId)

				let sessionUpdt = await sessionModel.updateSessionDetailBySessId(sessionId,urlcode);
				//console.log('----------sessionUpdt------------',sessionUpdt)	
			let sessionDt = await sessionModel.findSessionDetailBySessId(sessionId);


			let sessionStartTime = new Date(sessionDt.scheduleDate);

			let date = ("0" + sessionStartTime.getDate()).slice(-2);
			let month = ("0" + (sessionStartTime.getMonth() + 1)).slice(-2);
			let year = sessionStartTime.getFullYear();
			let hours = ("0" + sessionStartTime.getHours()).slice(-2);
			let minutes = ("0" + sessionStartTime.getMinutes()).slice(-2);
			let seconds = ("0" + sessionStartTime.getSeconds()).slice(-2);


			//let sessionStartDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

			let sessionStartDate= month+'/'+date+'/'+year;

			let localeSpecificTime = sessionStartTime.toLocaleTimeString('en-US', {timeZone: "America/New_York"});
			let localeSpecificTime1=localeSpecificTime.replace(/:\d+ /, ' ');
			let zoneAbbr=moment1.tz('America/New_York').format('z');
			console.log('------nyyyyyyyyyyyyy---',zoneAbbr)
			//console.log('------sessionDt-----------',sessionDt)

			// let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 22px; margin-bottom: 30px;">Hi '+sessionDt.firstName+', your session was successfully created. You can copy the link below and send it to any participant you would like to have sign up for the session. </p></div><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="'+urlcode+'" style="color: white; text-decoration: none;">'+urlcode+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div></body>';



			let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 22px; margin-bottom: 30px;">Channel: '+sessionDt.channelName+',Host: '+sessionDt.firstName+' '+sessionDt.lastName+', When: '+sessionStartDate+' at '+localeSpecificTime1+' '+zoneAbbr+'</p></div><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="'+urlcode+'" style="color: white; text-decoration: none;">'+urlcode+'</a> </div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">Team Virdio</p><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div></body>';

			//console.log('------html1-----------',html1)

			let toMail=sessionDt.email;
			let subject1='Sign up link for '+sessionDt.name+' on '+sessionStartDate+'';
				let text1='Please Check ur Mail';
	
				let sendmail1 = await SendMail.emailInput(toMail,subject1,html1);

		 	//let onBoarding = await userModel.getOnBoarding(sessionDt.email);
		 	//console.log('--------onBoarding----------',onBoarding)

			 let FirstSignup = await userModel.getFirstSignup(sessionDt.email);
			 console.log('--------FirstSignup----------',FirstSignup)
			 if(FirstSignup.isFirstSignup < 1)
			 {
 
			// let encodeEmail=sessionDt.email+'#'+sessionDt.firstName;
			//let encoded_email = await utils.encodedDecodedString(encodeEmail,0);	
			 //console.log('-----------encoded_email-----------',encoded_email)
 
				 // let html='<div class="email-box" style="padding: 20px 40px 20px 40px;box-shadow: 0px 0px 7px 2px #1c1c1c; background-color:#282828; font-family: Arial, Helvetica, sans-serif; flex-basis: 500px;"> <div class="" style="padding: 20px 0px; margin-bottom: 40px; text-align: center; border-bottom: 1px solid #444444;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 200px; text-align: center;"/></div><div class="content"><p class="" style="text-align: center; color: white; font-size: 24px; margin-bottom: 30px;">Hi '+sessionDt.firstName+', congratulations on creating for your first Virdio Session. Lets make sure everything works well on your primary device by clicking on the "Lets Setup Your Device" link below</p><p class="button_cont" style="padding-top: 60px; padding-bottom: 60px; text-align: center;"><a href="'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'" class="button1" style="padding: 10px 25px; background-color: #bd00ff; color: white !important; font-size: 18px; text-decoration: none !important;">Lets Setup Your Device</a></p></div><p style="text-align: center; color: white; font-size: 20px; margin-bottom: 10px;">If the above link is not working, then copy and paste the following URL in the browser address bar</p><div style="background-color: #bd00ff; padding: 10px 20px 10px 20px; text-align: center; margin: 50px 0px;"> <a href="" style="color: white; text-decoration: none;">'+process.env.DOMAIN_URL_For_onBoarding+"/"+ encoded_email+'</a> </div><div class="social_icon" style="text-align: center;"> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 5px;"/></a> <a href="#" class=""><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 5px;"/></a> </div></div>';	
				 
				 
				 let iosLink ="https://apps.apple.com/us/app/virdio/id1489704718";
 
				 let androidLink ="https://play.google.com/store/apps/details?id=mvvm.f4wzy.com.virdioApp";
				 
				 let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 15px 20px 15px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"> <p style="font-size: 22px; text-align: center; color: white;">Hi '+sessionDt.firstName+', get your remote by pressing the below button</p></div><div style="text-align: center; margin-top: 50px;"><p style="font-size: 20px; padding:10px 25px; display: inline-block; background-color: #b80df7; text-align: center;"><a href="'+iosLink+'" style="text-decoration: none; color: white;">Get Virdio iOS App</a></p></div><div style="text-align: center; margin-top: 35px;"><p style="font-size: 20px; background-color: #b80df7; padding:10px 25px;  display: inline-block; text-align: center; "><a href="'+androidLink+'" style="text-decoration: none; color: white;">Get Virdio Android App</a></p></div></div><div class="remote" style="background-color:#343434; margin-top: 150px; padding:10px; margin-bottom: 40px; display: flex; position: relative;"> <div style="width: 40%; height: 100%"> <img src="'+process.env.IMAGE_PATH+'/images/remote.png" style="width: 35%; position: absolute; bottom: 0px; left: -10px;"/> </div><p style="font-size: 22px; color: white; width: 60%;"> Use your Virdio Remote App to manage your session</p></div><p style="color: white; font-size: 22px; margin-top: 0px; color: white; text-align: center;">The Virdio Team</p><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
			 
				 //console.log('-------html123--------',html)
 
			 let to=sessionDt.email;
		 //let subject='Virdio Onboarding – Open Email on device you plan to host the session on.';
		 let subject='Link to download Virdio Remote App!';
			 let text='Please Check ur Mail';
 
			 let sendmail = await SendMail.emailInput(to,subject,html);
 
			 let updateFirstSignup = await userModel.UpdateFirstSignup(sessionDt.email);
			 }

				response.resp(res, 200, {urlcode,sessionDt})

				//response.resp(res, 200, {sessionId})
			} else {
				response.resp(res, 417, sessionId)

			} 

		// }else {

		// 	let msg ="session already exists!!!";
		// 	response.resp(res, 417, msg)

		// }
			
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}

	async uploadFile(request, res) {
		try {
			var mime = require('mime');
			var formidable = require('formidable');
			var util = require('util');
			var form = new formidable.IncomingForm();   
	
			
			var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';
			form.uploadDir = "./client/public"+dir;
			form.keepExtensions = true;
			form.maxFieldsSize = 10 * 1024 * 1024;
			form.maxFields = 1000;
			form.multiples = false;
		
			await form.parse(request, function(err, fields, files) {
				var file = util.inspect(files);
				console.log(file);
				var headers = {};
				headers["Access-Control-Allow-Origin"] = "https://secure.seedocnow.com";
				headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
				headers["Access-Control-Allow-Credentials"] = true;
				headers["Access-Control-Max-Age"] = '86400'; // 24 hours
				headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
				headers["Content-Type"] = "application/json";
	
	
				var fileName = file.split('path:')[1].split('\',')[0].split(dir)[1].toString().replace(/\\/g, '').replace(/\//g, '');
			   //console.log('---',fileName,process.cwd());
			   // var fileURL = 'http://localhost:3001/uploads/' + fileName;
				var fileURL = process.cwd()+'/client/public/uploads/' + fileName;
	
				 //slet fileContent = request.body.fileName;
	
				
				const fileContent = fs.readFileSync(fileURL);
				const params = {
				Bucket: BUCKET_NAME,
				Key: fileName,
				Body: fileContent
				};
	
				// Uploading files to the bucket
				s3.upload(params, function(err, data) {
					if (err) {
					   console.log(err);
	
					}
					console.log(`File uploaded successfully. ${data.Location}`);
				});
	
				//response.resp(res, 200, fileURL)
	
				// let insertData = [
				// 	[fileName, fields.userId, fields.sessionId, 1 ]     
				// ];
				// console.log('----------insertedData------------------',insertData);
	
				// let recordfile = recordsModel.addrecord(insertData);
				// res.status(200).send(user1);
				response.resp(res, 200, fileURL)
			});
	
				
				// res.status(200).send(user1);
				//response.resp(res, 200, user1)
					
			} catch(exception) {
				response.resp(res, 500, exception)
			}
		}


	async editNewChannel(req, res) {
	    try {		
			//let user_id=11;
			let user_id=req.currentUser.id;
			let channelId=req.params.channelId;
			console.log('-------userid333333333------------',user_id)

			//console.log('-------channelId------------',channelId)

			//console.log('-------lllt------------',req.body)

			if(false === isEmpty(req.body)){

				let cname=req.body.channel.name.trim();
				let Cdescription=req.body.channel.description.trim();
				let Cphone=req.body.channel.phone.trim();
				let City=req.body.channel.city.trim();
				let streetAdd1=req.body.channel.street_address1.trim();
				let streetAdd2=req.body.channel.street_address2.trim();
				let zipCode=req.body.channel.zip_code.trim();

			
				let output111111 = await ChannelsModel.getChannelImage(user_id,channelId);

				// console.log('-----------output111111-------------',output111111)
				// if( req.body.channel.image !='' && output111111.image != req.body.channel.image){
				// fs.unlink(`${process.cwd()}/admin/public${output111111.image}`, function (err) {
				// 	if (err) throw err;
				// 	// if no error, file has been deleted successfully
				// 	console.log('File deleted successfully!');
				// }); 
				// }

			let insertData = {		
				name : cname,
				description : Cdescription,
				individualOrBusiness : req.body.channel.chType ? req.body.channel.chType : 0,
				groupId : req.body.channel.groupId ? req.body.channel.groupId : 0,
				image : req.body.channel.image ? req.body.channel.image :"default.png",
				//image : "default.png",
				userId:user_id,
				phone : Cphone,
				//level : "2",
				street_address1 : streetAdd1 ? streetAdd1 : "",
				street_address2 : streetAdd2 ? streetAdd2 : "", 
				charge_amount  : req.body.channel.charge_amount ? req.body.channel.charge_amount : 0,
				chargeForSession  : req.body.channel.chargeForSession == true ? 1 : 0,
				city : City,
				country_code : req.body.channel.country_code ? req.body.channel.country_code : "",
				state_code : req.body.channel.state_code,
				zip_code : zipCode,
				account_name : req.body.channel.account_name,
				account_number : req.body.channel.account_number,
				account_type : req.body.channel.account_type,
				routing_number : req.body.channel.routing_number,
				ss : req.body.channel.ss ? req.body.channel.ss : 0,
				ein : req.body.channel.ein ? req.body.channel.ein : 0,
				has_shopping_list : req.body.channel.has_shopping_list == true ? 1 : 0,
				has_equipment_list : req.body.channel.has_equipment_list == true ? 1 : 0,
				has_product_list : req.body.channel.has_product_list == true ? 1 : 0
			};

			//console.log('----------insertData------------------',insertData)

			
			// insert into sessions table
			let output = await ChannelsModel.updatechannel(insertData,channelId);

			//console.log('----------insertData1111------------------',output)

			if(output > 0)
			{
				
				//if(channelhost.length != 0)
				if(req.body.channelHost.channel_Host.length != 0)
				{
//console.log('-------req.body.channelHost----------',req.body.channelHost.channel_Host)
					let channelHost111 = await channelHostModel.updateChannelHost(channelId);
					let channelhost=req.body.channelHost.channel_Host;
					let hostlist=[];
					 hostlist=channelhost;					 

					 let channelHostData;

					 for(let i in hostlist){
						channelHostData = [[hostlist[i],channelId,user_id]]
				//console.log('----------channelHostData------------------',channelHostData)

					let channelUserRes = await channelHostModel.addChannelHost(channelHostData);
					//console.log('----------channelUserRes------------------',channelUserRes)
					 }


				}

				

				if(req.body.InterestHost.Interest_Host.length != 0)
				{
				
		//console.log('-------req.body.InterestHost----------',req.body.InterestHost.Interest_Host)	
					let channelInterest123 = await ChannelInterestModel.updateChannelInterest(channelId);

					let Interesthost=req.body.InterestHost.Interest_Host;
					let interestList=[];
					 interestList=Interesthost;					 

					 let interestListData;

					 for(let i in interestList){
						interestListData = [[channelId,interestList[i]]]
						//console.log('----------interestListData------------------',interestListData)

					let InterestUserRes = await ChannelInterestModel.addChannelInterest(interestListData);
					//console.log('----------InterestUserRes------------------',InterestUserRes)
					 }


				}
				response.resp(res, 200, output);

			}else {
				//response.resp(res, 500, {message:"Something went wrong."})
				response.resp(res, 417, output)
			}

		}
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async sessionHistorySave(req, res) {
	    try {		
			//let user_id=11;
			let user_id=req.currentUser.id;
		
			console.log('-------userid333333333------------',user_id)

			console.log('-------lllt------------',req.body)

			let historydata =req.body.history;

			let date_ob = new Date(historydata.timeStamp);

			console.log('----------date_ob------------------',date_ob)
			
			let date = ("0" + date_ob.getDate()).slice(-2);
			let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
			let year = date_ob.getFullYear();
			let hours = ("0" + date_ob.getHours()).slice(-2);
			let minutes = ("0" + date_ob.getMinutes()).slice(-2);
			let seconds = ("0" + date_ob.getSeconds()).slice(-2);

			let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;
			let deviceInformation1=historydata.deviceInformation ? JSON.stringify(historydata.deviceInformation) :"";

			if(false === isEmpty(req.body)){

			let insertData = {		
				sessionId : historydata.sessionId,
				userId : historydata.userId,
				activityType : historydata.activityType ? historydata.activityType : "none",
				timeStamp : currentDate,
				rtm : historydata.rtm ? historydata.rtm : "none",
				deviceInformation : deviceInformation1,
				emojiesId : historydata.emojiesId ? historydata.emojiesId :null, 
				systemIp  : historydata.systemIp ? historydata.systemIp : "",
				status : 1
				
			};

			console.log('----------insertData------------------',insertData)

			let sessionHistoryId = await sessionHistoryModel.addsessionHistory(insertData);

			if(sessionHistoryId > 0)
					{
						response.resp(res, 200, sessionHistoryId);
					}else{
						response.resp(res, 400, {message:"Threre problem to inserting tha session event"})
					}
				}else{
					response.resp(res, 400, {message:"Blank Input is not allowed!!!!!"})
				}

		//console.log('----------insertData333333------------------',channelId)	
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}



	async add_interestOnChannel(req, res) {
	    try {		
			//let user_id=11;
			//let user_id=req.currentUser.id;

			console.log('-------lllt------------',req.body)

			let channelId=req.body.channelId;

			if(req.body.Interest.length != 0)
				{		
					

					let Interesthost=req.body.Interest;
					let interestList=[];
					 interestList=Interesthost;					 
					 console.log('-------interestList------------',interestList)
					 let interestListData;

					 for(let i in interestList){
						interestListData = [[channelId,interestList[i].interestId]]
						console.log('----------interestListData------------------',interestListData)

						let InterestRes = await ChannelInterestModel.getChannelInterest(channelId,interestList[i].interestId);

						console.log('----------InterestRes------------------',InterestRes)

						if(InterestRes.length < 1)
						{

							let InterestUserRes = await ChannelInterestModel.addChannelInterest(interestListData);
						}

					
					 }
					 

					 let msg ="interest has been uploaded successfully!!!!";

					 response.resp(res, 200, msg);

				}else{

					let msg ="Please select Interest!!!";

					response.resp(res, 417, msg);

				}

		//console.log('----------insertData333333------------------',channelId)	
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}



	async delete_interestOnChannel(req, res) {
	    try {		
	
			let channelId=req.params.channelId;
			if(req.body.Interest.length != 0)
			{
			let Interesthost=req.body.Interest;
					let interestList=[];
					 interestList=Interesthost;					 
					 console.log('-------interestList------------',interestList)
				
			//console.log('-------lllt------------',channelId,interestId)

			for(let i in interestList){

			let InterestRes = await ChannelInterestModel.deleteChannelInterest(channelId,interestList[i].interestId);
			}

			 let msg ="interest has been deleted successfully!!!!";

			 response.resp(res, 200, msg);
		}else{

			let msg ="Please select Interest!!!";

			response.resp(res, 417, msg);

		}
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async addMemberChannelWise(req, res) {
	    try {		
	
		
			if(false === isEmpty(req.body)){

				let memDta=req.body;
				//console.log('------------memDta--------------',memDta);

				let firstName1 = memDta.firstName.trim();
                let channelId = memDta.channelId;
				let emailId = memDta.email.trim();
				let msg = '';
				if(firstName1 == '' )
				{
					 msg ="Please enter firstName!!!!!!";
					response.resp(res, 417, msg);
				}

				else if(emailId == '')
				{
					 msg ="Please enter email!!!!!!";
					response.resp(res, 417, msg);
			}else{
				let memObj = await memberModel.getExistsMemByEmail(emailId,channelId);

				if(isEmpty(memObj)){

					//console.log('----------memObj------------------',memObj)

				let insertData = {		
					channelId : memDta.channelId,
					firstName : firstName1 ? firstName1 : "null",
					lastName : memDta.lastName ? memDta.lastName  : "",
					email : emailId					
				};
	
				//console.log('----------insertData------------------',insertData)
	
				let memId = await memberModel.addmembers(insertData);

				//console.log('------------memId--------------',memId);

				if(memId > 0)
				{
					 msg ="Member has been added successfully!!!";
					response.resp(res, 200, msg);
				}else{
					 msg ="There is a problem in adding";
					response.resp(res, 417, msg);
					}

				}else{

					 msg ="Member already exists";
					response.resp(res, 417, msg);
				}
			}
		}
	
	    } catch(exception) {
			//console.log('--------exception----------')
			response.resp(res, 500, exception);
	    }
	}


	async getMemberChannelWise(req, res) {
	    try {		
	
			let channelId=req.params.channelId;
			//console.log('---------------',req)
			//let channelId=req.query.channelId;		
			let memberData = await memberModel.getmembers(channelId);
			response.resp(res, 200, memberData);
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async editMemberChannelWise(req, res) {
	    try {		
	
			//let memberId=req.params.memberId;
			let memberId=req.query.memberId;
			if(false === isEmpty(req.body)){

				let memDta=req.body;
				//console.log('------------memDta--------------',memDta);

				let firstName1 = memDta.firstName.trim();
				let channelId = memDta.channelId;

				let emailId = memDta.email.trim();
				if(firstName1 == ''){
					 msg ="Please enter firstName!!!!!!";
					response.resp(res, 417, msg);
				}

				else if(emailId == '')
				{
					 msg ="Please enter email!!!!!!";
					response.resp(res, 417, msg);
				}
			}else{
					let memObj = await memberModel.getExistsMemByEmail(emailId,channelId);
					if(isEmpty(memObj))
					{

						//console.log('----------memObj------------------',memObj)

						let insertData = {		
							firstName : firstName1 ? firstName1 : "null",
							lastName : memDta.lastName ? memDta.lastName  : "",
							email : emailId					
						};
		
						//console.log('----------insertData------------------',insertData)
			
						let memId = await memberModel.updateMembers(insertData,memberId);

						//console.log('------------memId--------------',memId);

						if(memId > 0)
						{
							msg ="Member has been update successfully!!!";
							response.resp(res, 200, msg);
						}else{
							msg ="There is a problem in Update";
							response.resp(res, 417, msg);
							}

						// }else{

						//  msg ="This member is already exist into this channel";
						// response.resp(res, 417, msg);
					}
				}
			// }
	
	    } catch(exception) {
			//console.log('--------exception----------')
			response.resp(res, 500, exception);
	    }
	}



	async deleteMemberChannelWise(req, res) {
	    try {		
	
			//let memberId=req.params.memberId;
			let memberId=req.query.memberId;
			let memObj = await memberModel.getExistsMemById(memberId);
			if(!isEmpty(memObj)){
			let memRes = await memberModel.deleteMember(memberId);

			if(memRes > 0){
		
			 let msg ="Member has been deleted successfully!!!!";

			 response.resp(res, 200, msg);
			}else{

				let msg ="There Is Problem in deleteing!!!!";
				response.resp(res, 417, msg);

			}
		}else{
			let msg ="Member is not exist in the table";
			response.resp(res, 417, msg);
		}
	
	
	    } catch(exception) {
			//console.log('--------exception----------')
			response.resp(res, 500, exception);
	    }
	}



	async updateMemberchannelWise(req, res) {
	    try {		
	
			//let memberId=req.params.memberId;
			let memberId=req.query.memberId;		
			let status=req.body.status;
			console.log("STATUS----->",status)
			let memObj = await memberModel.getExistsMemById(memberId);
			//console.log('--------memObj----------',memObj)
			if(!isEmpty(memObj)){
			let memRes = await memberModel.updateMemberStatus(memberId,status);

			if(memRes > 0){
		
			 let msg ="member status has been updated successfully!!!!";

			 response.resp(res, 200, msg);
			}else{

				let msg ="There Is Problem in Updateing!!!!";
				response.resp(res, 417, msg);

			}
			}else{
				let msg ="Member is not exist in the table11";
				response.resp(res, 417, msg);
			}
	
	    } catch(exception) {
			//console.log('--------exception----------')
			response.resp(res, 500, exception);
	    }
	}





	async getSessionUserExist(req, res) {
	    try {		
	
			let sessionId=req.params.sessionId;
		//let userId=72;
		let userId=req.currentUser.id;
			let sessionData = await sessionModel.sessionUserExist(sessionId,userId);
			if(sessionData.length > 0)
			{
				let msg = "yes";
				response.resp(res, 200, msg);
			}else{
				let msg = "no";
				response.resp(res, 200, msg);
			}
			
	    } catch(exception) {
			response.resp(res, 500, exception);
	    }
	}


	async getDefaultSessionCompleted(req, res) {
	    try {		
	
		//let userId=72;
		let userId=req.currentUser.id;
	//	console.log('--------userId-----------------',userId)
			let sessionData = await sessionModel.getdefaultSessionStatus(userId);

			console.log('--------sessionData.length-----------------',sessionData)
			if(sessionData.length > 0)
			{

				// let msg = "yes";
				// response.resp(res, 200, msg);
				if(sessionData[0].isTutorialRead == 1 && sessionData[0].isTutorialStart == 2)
				{
					 let msg = "openPopup";
				 response.resp(res, 200, msg);
				}else if(sessionData[0].isTutorialRead == 2 && sessionData[0].isTutorialStart == 2 && sessionData[0].isCompleted == 0)
				{
					let msg = "openPopup";
				 response.resp(res, 200, msg);
				}else if(sessionData[0].isTutorialRead == 2 && sessionData[0].isTutorialStart == 2 && sessionData[0].isCompleted > 0)
				{
				 let msg = "yes";
				 response.resp(res, 200, msg);
				}else if(sessionData[0].isTutorialRead == 1 && sessionData[0].isTutorialStart == 1)
				{
				let msg = "no";
				response.resp(res, 200, msg);
				}else{
					let msg = "no";
					response.resp(res, 200, msg);
				}
			}else{
				let msg = "no";
				response.resp(res, 200, msg);
			}
			
	    } catch(exception) {
			//console.log('---------exception------------',exception)
			response.resp(res, 500, exception);
	    }
	}


	async updateDefaultSessionStatus(req, res) {
	    try {		
		
		let sessionId=req.body.sessionId;
		//console.log('--------sessionId-----------------',sessionId)

		let newData = await sessionModel.findSessionDetailBySessId(sessionId);

		//console.log('--------newData-----------------',newData)

		if(newData.isTutorialRead == 0)
		{
			let msg = "not a default session";
			response.resp(res, 417, msg);
		}else if (newData.isTutorialRead == 2)
		{
			let msg = "Already updated";
			response.resp(res, 417, msg);
		}else{
		
			let sessionData = await sessionModel.updateSessionIsTutorialStatus(sessionId);

			//console.log('--------sessionData-----------------',sessionData)
			if(sessionData > 0)
			{
				let msg = "updated successfully";
				response.resp(res, 200, msg);
			}else{
				let msg = "not updated";
				response.resp(res, 417, msg);
			}

		}
			
	    } catch(exception) {
			console.log('---------exception------------',exception)
			response.resp(res, 500, exception);
	    }
	}

	async updateDefaultSessionTutorialStart(req, res) {
	    try {		
		
		let sessionId=req.body.sessionId;
		//console.log('--------sessionId-----------------',sessionId)

		let newData = await sessionModel.findSessionDetailBySessId(sessionId);

		//console.log('--------newData-----------------',newData)

		if(newData.isTutorialStart == 0)
		{
			let msg = "not a default session";
			response.resp(res, 417, msg);
		}else if (newData.isTutorialStart == 2)
		{
			let msg = "Already updated";
			response.resp(res, 417, msg);
		}else{
		
			let sessionData = await sessionModel.updateSessionIsDefaultTutorialStartStatus(sessionId);

			//console.log('--------sessionData-----------------',sessionData)
			if(sessionData > 0)
			{
				let msg = "updated successfully";
				response.resp(res, 200, msg);
			}else{
				let msg = "not updated";
				response.resp(res, 417, msg);
			}

		}
			
	    } catch(exception) {
			console.log('---------exception------------',exception)
			response.resp(res, 500, exception);
	    }
	}

	async updateDefaultSessionEndTime(req, res) {
	    try {		
		
		//let sessionId=req.body.sessionId;
		//console.log('--------sessionId-----------------',sessionId)

		let userId=req.currentUser.id;
		//let userId=107;
	
		//console.log('--------userId-----------------',userId)

		let newData = await sessionModel.getSessionByUserId(userId);

		//let newData = await sessionModel.getSessionDetailBySessId(sessionId);

		console.log('--------newData-----------------',newData.length)

		if(newData.length > 0)
		{
			let sessionId= newData[0].id;

		if(newData[0].isTutorialRead == 1){
			let duration=10080;
			let date_ob11 = new Date();

			let date_ob1=date_ob11.setMinutes(date_ob11.getMinutes() + 3);
			
			let date_ob = new Date(date_ob1);

			//console.log('----------date_ob------------------',date_ob)
	    	
			let date = ("0" + date_ob.getDate()).slice(-2);
			let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	    	let year = date_ob.getFullYear();
			let hours = ("0" + date_ob.getHours()).slice(-2);
			let minutes = ("0" + date_ob.getMinutes()).slice(-2);
			let seconds = ("0" + date_ob.getSeconds()).slice(-2);


			let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

			console.log('------currentDate--------',currentDate)

			let sessionEndTimeinMinutes=date_ob.setMinutes(date_ob.getMinutes() + 10080);
			
			let sessionEndTime = new Date(sessionEndTimeinMinutes);

			//console.log('------sessionEndTime--------',sessionEndTime)
			
			let date1 = ("0" + sessionEndTime.getDate()).slice(-2);
			let month1 = ("0" + (sessionEndTime.getMonth() + 1)).slice(-2);
	    	let year1 = sessionEndTime.getFullYear();
			let hours1 = ("0" + sessionEndTime.getHours()).slice(-2);
			let minutes1 = ("0" + sessionEndTime.getMinutes()).slice(-2);
			let seconds1 = ("0" + sessionEndTime.getSeconds()).slice(-2);


			let endDate= year1+'-'+month1+'-'+date1+' '+hours1 + ':' + minutes1 + ':' + seconds1;

			console.log('------endDate--------',endDate)
		
			let sessionData = await sessionModel.updateNewDefaultSession(sessionId,currentDate,endDate,duration);

			console.log('--------sessionData-----------------',sessionData)
			if(sessionData > 0)
			{
				let msg = "updated successfully";
				response.resp(res, 200, msg);
			}else{
				let msg = "not updated";
				response.resp(res, 417, msg);
			}

		}else{

			let msg = "Already updated";
			response.resp(res, 417, msg);
			}
		}else{
			
			let msg = "There is no any Session";
			response.resp(res, 417, msg);
		}

		// let msg = "Already updated";
		//  	response.resp(res, 417, msg);
			
	    } catch(exception) {
			console.log('---------exception------------',exception)
			response.resp(res, 500, exception);
	    }
	}

	async sessionCompleted(req, res) {
	    try {
			let updateData = await sessionModel.updateSessionCompletedStatus(req.currentUser.id, req.params.sessionId);
			response.resp(res, 200, updateData)
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}

	async sessionCancel(req, res) {
	    try {
			let userId=req.currentUser.id;
			//let userId=145;
			let updateData ='';
		let userData = await sessionModel.findSessionDetail1(req.params.sessionId,userId);

		console.log('----userData----',userData);

		let date_ob = new Date();

		let date = ("0" + date_ob.getDate()).slice(-2);
		let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
		let year = date_ob.getFullYear();
		let hours = ("0" + date_ob.getHours()).slice(-2);
		let minutes = ("0" + date_ob.getMinutes()).slice(-2);
		let seconds = ("0" + date_ob.getSeconds()).slice(-2);


		let currentDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes;



		let sessionStartTime = new Date(userData.scheduleDate);

		let date1 = ("0" + sessionStartTime.getDate()).slice(-2);
		let month1 = ("0" + (sessionStartTime.getMonth() + 1)).slice(-2);
		let year1 = sessionStartTime.getFullYear();
		let hours1 = ("0" + sessionStartTime.getHours()).slice(-2);
		let minutes1 = ("0" + sessionStartTime.getMinutes()).slice(-2);
		let seconds1 = ("0" + sessionStartTime.getSeconds()).slice(-2);


		//let sessionStartDate= year+'-'+month+'-'+date+' '+hours + ':' + minutes + ':' + seconds;

		let sessionStartDate= month1+'/'+date1+'/'+year1;

		let timezone22='';
		if(false === isEmpty(userData.timeZone))
		{
			console.log('--------yes---------')
			timezone22 = userData.timeZone;
		}else {
			console.log('--------no---------')
			timezone22 = "America/New_York";
		}

		let localeSpecificTime = sessionStartTime.toLocaleTimeString('en-US', {timeZone: timezone22});
		let localeSpecificTime1=localeSpecificTime.replace(/:\d+ /, ' ');
		let zoneAbbr=moment1.tz(timezone22).format('z');
		console.log('------nyyyyyyyyyyyyy---',zoneAbbr)
				
			let sessionUserData = await sessionUserModel.getUsermemToThisSession(req.params.sessionId,userId);

			if(sessionUserData[0].type != 2){
				console.log('----no----');
			let updateData1 = await sessionModel.updateSessionCancelStatus(userId,req.params.sessionId);
			let updateData3 = await sessionUserModel.updateSessionCancelStatusByParticipant(userId,req.params.sessionId);		
			updateData = updateData1;
			if(updateData == 1)
			{
			
				let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"><p style="font-size: 22px; text-align: center; color: white;">Hi '+userData.firstName+', this is to confirm the cancellation of your session, "'+userData.name+'" on '+sessionStartDate+' at '+localeSpecificTime1+' '+zoneAbbr+'.</p><p style="font-size: 22px; color: white; margin-top: 0px; text-align:center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
				//console.log('-------html--------',html)
				let to1=userData.email;
				let subject1='Cancellation of your session';
				let text1='Please Check ur Mail';

				let sendmail = await SendMail.emailInput(to1,subject1,html1);

				let totalSignup = await sessionUserModel.getTotalSignup(req.params.sessionId);
				console.log('----totalSignup----',totalSignup);
				if(totalSignup.length > 0)
				{
					for(let i in totalSignup){

						let userObj1=totalSignup[i];
		let updateData4 = await sessionUserModel.updateSessionCancelStatusByParticipant(userObj1.userId,req.params.sessionId);	
							let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"><p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj1.firstName+', your session, "'+userData.name+'"  on '+sessionStartDate+' at '+localeSpecificTime1+' '+zoneAbbr+',  with '+userData.firstName+'  has been cancelled.  If you have questions regarding the cancellation of this session, please contact '+userData.firstName+'.</p><p style="font-size: 20px; color: white; margin-top: 0px; text-align:center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
						//console.log('-------html--------',html)
						let to=userObj1.email;
						let subject='Cancellation of your session';
						let text='Please Check ur Mail';

						let sendmail = await SendMail.emailInput(to,subject,html);

					}
				}
			}
		}else{
				console.log('----yes----');
				let hostdetail = await sessionModel.getSessionHostDetail(req.params.sessionId);

				console.log('-----hostdetail--------------',hostdetail)
				let updateData2 = await sessionUserModel.updateSessionCancelStatusByParticipant(userId,req.params.sessionId);
				updateData = updateData2;
				if(updateData == 1)
				{

					let html1='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 25px 20px 25px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 130px;"/></div><div class="content"><p style="font-size: 22px; text-align: center; color: white;">Hi '+userData.firstName+',  this is to confirm your cancellation of your session, "'+userData.name+'"  on '+sessionStartDate+' at '+localeSpecificTime1+' '+zoneAbbr+',  with '+hostdetail[0].firstName+' '+hostdetail[0].lastName+'.</p><p style="font-size: 22px; color: white; margin-top: 0px; text-align:center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
					//console.log('-------html--------',html)
					let to1=userData.email;
					let subject1='Session Cancellation!';
					let text1='Please Check ur Mail';
	
					let sendmail = await SendMail.emailInput(to1,subject1,html1);

			
				if(hostdetail.length > 0)
				{

					let userObj1=hostdetail[0];
					let html='<body style="font-family:Arial, sans-serif;"> <div class="email-box" style="box-shadow: 0px 0px 7px 2px #1c1c1c; max-width: 600px; padding: 20px 20px 20px 20px; box-sizing: border-box; background-color: #282828; margin: auto;"><div style="padding: 0px 20px;"> <div style="border-bottom: 1px solid #444444; padding-bottom: 20px; text-align: center; margin-bottom: 40px;"><img src="'+process.env.IMAGE_PATH+'/images/logo_mail.png" style="max-width: 140px;"/></div><div class="content"><p style="font-size: 22px; text-align: center; color: white;">Hi '+userObj1.firstName+', we wanted to let you know that '+userData.firstName+' cancelled their participation in your session, "'+userData.name+' "  on '+sessionStartDate+' at '+localeSpecificTime1+' '+zoneAbbr+' . For quick reference, their email is '+userData.email+'</p><p style="font-size: 22px; color: white; margin-top: 0px; text-align: center;">Team Virdio</p></div></div><div style="text-align: center;"> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/facebook.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/insta.png" style="margin: 3px; width: 40px;"/></a> <a href="#" class="mx-2"><img src="'+process.env.IMAGE_PATH+'/images/twitter.png" style="margin: 3px; width: 40px;"/></a> </div></div></body>';
					
					//console.log('-------html--------',html)
					let to=userObj1.email;
					let subject='Session Participant Cancellation';
					let text='Please Check ur Mail';

					let sendmail = await SendMail.emailInput(to,subject,html);
				}

				}
			}
			response.resp(res, 200, updateData)
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}

	async updateIsTutorialRead(req, res) {
	    try {		
		
		let userId=req.currentUser.id;
		//let userId=107;
	
		//console.log('--------userId-----------------',userId)

		let newData = await sessionModel.getSessionByUserId(userId);

	
		//console.log('--------newData-----------------',newData)

		if(newData.length > 0)
		{

			let sessionId= newData[0].id;

		if(newData.isTutorialRead == 0)
		{
			let msg = "not a default session";
			response.resp(res, 417, msg);
		}else if (newData.isTutorialRead == 2)
		{
			let msg = "Already updated";
			response.resp(res, 417, msg);
		}else{
		
			//let sessionData = await sessionModel.updateSessionIsTutorialStatus(sessionId);

			let sessionData = await sessionModel.updateSessionTutorialStatus(sessionId);

			//console.log('--------sessionData-----------------',sessionData)
			if(sessionData > 0)
			{
				let msg = "updated successfully";
				response.resp(res, 200, msg);
			}else{
				let msg = "not updated";
				response.resp(res, 417, msg);
			}

		}
	}else{
		let msg = "There is no any session";
		response.resp(res, 417, msg);
	}
			
	    } catch(exception) {
			console.log('---------exception------------',exception)
			response.resp(res, 500, exception);
	    }
	}

}

module.exports = new SessionCtrl();