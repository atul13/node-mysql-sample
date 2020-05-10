const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");
const underscore = require("underscore");

class Session{

	constructor(){
		this.table = 'sessions';
	}

	/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextSession(userId,type,dateTime1) {
		if(dateTime1 != null)
		{
        return await new Promise((resolve, reject) => {
        	//db.query('SELECT s.*, i.code,i.groupId, su.sessionId, su.userId, su.type, u.firstName as hostFirstName, u.lastName as hostLastName, u.email as hostEmail, u.image as hostImage FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id JOIN users u ON u.id = s.hostId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND su.type = ? AND su.status = 1 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate > UTC_TIMESTAMP()  ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {
			
				db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND su.type = ?  AND s.isTutorialRead = 0 AND s.isCompleted = 0  AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate >"'+dateTime1+'"  AND s.sessionEndDate <= DATE("'+dateTime1+'")+ INTERVAL 7 DAY GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {	
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
		
	}else{
		return await new Promise((resolve, reject) => {
        				
				db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND su.type = ? AND s.isTutorialRead = 0  AND s.isCompleted = 0  AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate > UTC_TIMESTAMP()  AND s.sessionEndDate <= DATE_ADD(DATE(UTC_TIMESTAMP()), INTERVAL 7 DAY) GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {	
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  
			  return resolve(results);
			});
		});
	}
	}


	/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextDeafaultSession(userId,type) {
	
        return await new Promise((resolve, reject) => {				   
				db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ?  AND su.type = ?  AND s.isTutorialRead > 0 AND s.isCompleted = 0  AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {
					
			  if (error) reject(error);
			// console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});

	}


	async getPastSession(userId,type,dateTime1) {
		// if(dateTime1 != null)
		// {
        // return await new Promise((resolve, reject) => {
        // 	db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code, i.groupId, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ?  AND su.type = ? AND s.isTutorialRead = 0  AND s.isCompleted > 0 AND su.status = 1 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate < "'+dateTime1+'" AND s.sessionEndDate >= DATE("'+dateTime1+'")- INTERVAL 7 DAY GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {			
		// 	  if (error) reject(error);
		// 	  // console.log('================== results ', results)
		// 	  // db.end();
		// 	  return resolve(results);
		// 	});
		// });
		
		// }else{

			return await new Promise((resolve, reject) => {
				db.query('SELECT s.id,s.interestId,su.sessionStatus as sessionStatus,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.groupId,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code, i.groupId, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ?  AND su.type = ? AND s.isTutorialRead = 0   AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND (s.sessionEndDate < UTC_TIMESTAMP() OR  s.isCompleted > 0  OR su.sessionStatus = 2) GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {					
				  if (error) reject(error);
				  // console.log('================== results ', results)
				  // db.end();
				  return resolve(results);
				});
			});
		//}
	}


		/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getPastDeafaultSession(userId,type) {
	
        return await new Promise((resolve, reject) => {				   
				db.query('SELECT s.id,s.interestId,su.sessionStatus as sessionStatus,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ?  AND su.type = ?  AND s.isTutorialRead = 2  AND  (s.isCompleted > 0 OR su.sessionStatus = 2)  AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {
					
			  if (error) reject(error);
			// console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});

	}


	/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextOnDemandSessionByChannelId(userId,type,data,dateTime1,weekend) {

		console.log('------------dateTime1----------------',dateTime1)

		if(dateTime1 != null)
			{
        return await new Promise((resolve, reject) => {				   
				db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id INNER JOIN channels ch ON ch.id = s.sessionChannelId  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+')  AND su.type = ? AND s.isTutorialRead = 0  AND s.onDemand = 1 AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate >"'+dateTime1+'"  AND s.sessionEndDate <= DATE("'+dateTime1+'")+ INTERVAL 7 DAY GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {
					
			//db.query('SELECT s.id,s.interestId,s.groupId,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.userId = ? AND su.type = ? AND su.status = 1 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate > UTC_TIMESTAMP() GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {	
			  if (error) reject(error);
			// console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});
	}else{

		return await new Promise((resolve, reject) => {				   
			db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,ch.image as channelImage,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id  JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.type = ? AND s.isTutorialRead = 0  AND s.onDemand = 1  AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate > UTC_TIMESTAMP()  AND s.sessionEndDate < DATE("'+weekend+'")+ INTERVAL 2 DAY  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {
		  if (error) reject(error);
		 console.log('================== results ', error)
		  // db.end();
		  return resolve(results);
		});
		});

		}
	}


		/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextSessionByChannelId(userId,type,data,dateTime1,weekend) {

		console.log('------------dateTime1----------------',dateTime1)

		if(dateTime1 != null)
			{
        return await new Promise((resolve, reject) => {				   
				db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+')  AND su.type = ? AND s.isTutorialRead = 0  AND s.isCompleted = 0  AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate >"'+dateTime1+'"  AND s.sessionEndDate <= DATE("'+dateTime1+'")+ INTERVAL 7 DAY GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {
					
			//db.query('SELECT s.id,s.interestId,s.groupId,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.userId = ? AND su.type = ? AND su.status = 1 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate > UTC_TIMESTAMP() GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {	
			  if (error) reject(error);
			// console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});
	}else{
		
		return await new Promise((resolve, reject) => {				   
			db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id  JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.type = ? AND s.isTutorialRead = 0 AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate > UTC_TIMESTAMP()  AND s.sessionEndDate < DATE("'+weekend+'")+ INTERVAL 2 DAY  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {
		  if (error) reject(error);
		 console.log('================== results ', error)
		  // db.end();
		  return resolve(results);
		});
		});

		}
	}

		/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextSessionInNextWeek(userId,type,data,dateTime1) {
		console.log('-----dateTime1--------',dateTime1)
		if(dateTime1 != null)
		{

		return await new Promise((resolve, reject) => {				   
			db.query('SELECT s.id,s.name,s.scheduleDate, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id  JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.type = ? AND s.isTutorialRead = 0 AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.scheduleDate >"'+dateTime1+'"  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC LIMIT 1', [type], function (error, results, fields) {
		  if (error) reject(error);
		 console.log('================== results ', error)
		  // db.end();
		  return resolve(results);
		});
		});

	}else{

		return await new Promise((resolve, reject) => {				   
			db.query('SELECT s.id,s.name,s.scheduleDate, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id  JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.type = ? AND s.isTutorialRead = 0 AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.scheduleDate > UTC_TIMESTAMP()  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC LIMIT 1', [type], function (error, results, fields) {
		  if (error) reject(error);
		 console.log('================== results ', error)
		  // db.end();
		  return resolve(results);
		});
		});

	}

	}

			/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextSessionInNextWeekforParticipant(userId,type,dateTime1) {
		console.log('-----dateTime1--------',userId,type,dateTime1)
		if(dateTime1 != null)
		{

		return await new Promise((resolve, reject) => {				   
			db.query('SELECT s.id,s.name,s.scheduleDate, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id  JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND su.type = ? AND s.isTutorialRead = 0 AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.scheduleDate >"'+dateTime1+'"  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC LIMIT 1', [userId,type], function (error, results, fields) {
		  if (error) reject(error);
		 console.log('================== results ', error)
		  // db.end();
		  return resolve(results);
		});
		});

	}else{

		return await new Promise((resolve, reject) => {				   
			db.query('SELECT s.id,s.name,s.scheduleDate, su.sessionId, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id  JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND su.type = ? AND s.isTutorialRead = 0 AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.scheduleDate > UTC_TIMESTAMP()  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC LIMIT 1', [userId,type], function (error, results, fields) {
		  if (error) reject(error);
		 console.log('================== results ', error)
		  // db.end();
		  return resolve(results);
		});
		});

	}

	}
	/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextDeafaultSessionByChannelId(userId,type,data) {
	
        return await new Promise((resolve, reject) => {				   
				db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+')  AND su.type = ?  AND s.isTutorialRead > 0 AND s.isCompleted = 0  AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {
					
			  if (error) reject(error);
			// console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});

	}


	async getPastDeafaultSessionByChannelId(userId,type,data) {
	
        return await new Promise((resolve, reject) => {				   
				db.query('SELECT s.id,s.interestId,su.sessionStatus as sessionStatus,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+')  AND su.type = ? AND s.isTutorialRead = 2 AND s.isCompleted > 0  AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL  GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {
					
			  if (error) reject(error);
			// console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});

	}


	async getPastSessionByChannelId(userId,type,data,dateTime1) {

		// if(dateTime1 != null)
		// {

        // return await new Promise((resolve, reject) => {

		// 	console.log('--------userId,type,data------------',userId,type,data,dateTime1)

        // 	db.query('SELECT s.id,s.interestId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.groupId,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code, i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+') AND su.type = ? AND s.isTutorialRead = 0  AND s.isCompleted > 0  AND su.status = 1 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.sessionEndDate < "'+dateTime1+'" AND s.sessionEndDate >= DATE("'+dateTime1+'")- INTERVAL 7 DAY GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {					
		// 	  if (error) reject(error);
		// 	  // console.log('================== results ', error)
		// 	  // db.end();
		// 	  return resolve(results);
		// 		});
		// 	});
		// }else{

			return await new Promise((resolve, reject) => {

				console.log('--------userId,type,data------------',userId,type,data,dateTime1)
	
				db.query('SELECT s.id,s.interestId,su.sessionStatus as sessionStatus,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.groupId,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code, i.groupId, su.sessionId, su.userId, su.type,Date(s.scheduleDate) as sessionDateCreated FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  LEFT JOIN interest i ON i.id = s.interestId WHERE s.sessionChannelId in ('+data+')  AND su.type = ?  AND s.isTutorialRead = 0   AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND (s.sessionEndDate < UTC_TIMESTAMP() OR  s.isCompleted > 0 OR su.sessionStatus = 2) GROUP BY su.sessionId ORDER BY s.scheduleDate ASC', [type], function (error, results, fields) {					
				  if (error) reject(error);
				//   console.log('================== results ', error)
				  return resolve(results);
					});
				});
		//}
	}


	/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getTotalSession(sessionChannelId,type) {
		console.log('-----sessionChannelId,type------------',sessionChannelId,type)
		if(type == "upComingSession"){
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id as sessionId, s.name as sessionName,s.scheduleDate, u.id as userId, u.firstName as userName   FROM sessions s INNER JOIN users as u on u.id=s.hostId  WHERE  s.sessionChannelId = ?  AND u.status = 1 AND u.type = 1  AND s.status = 1 AND s.isTutorialRead = 0 AND s.isCompleted = 0 AND s.scheduleDate IS NOT NULL AND s.sessionEndDate >  UTC_TIMESTAMP()  ORDER BY s.scheduleDate ASC', [sessionChannelId], function (error, results, fields) {
			  if (error) reject(error);
			 //  console.log('================== results ', error)
			  return resolve(results);
			});
		});
		}else{
			return await new Promise((resolve, reject) => {
				db.query('SELECT count(s.id) as total FROM sessions s  WHERE  s.sessionChannelId = ?  AND s.status = 1  AND s.isTutorialRead = 0   AND s.scheduleDate IS NOT NULL AND (s.sessionEndDate <  UTC_TIMESTAMP() OR s.isCompleted > 0)  ORDER BY s.scheduleDate ASC ', [sessionChannelId], function (error, results, fields) {
				  if (error) reject(error);
				 //  console.log('================== results ', error)
				  // db.end();
				  return resolve(isEmpty(results) ? '' : results[0]);
				});
			});

		}
	}



	async getTotalDefaultSession(sessionChannelId,type) {
		console.log('-----sessionChannelId,type------------',sessionChannelId,type)
		if(type == "upComingSession"){
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id as sessionId, s.name as sessionName,s.scheduleDate, u.id as userId, u.firstName as userName   FROM sessions s INNER JOIN users as u on u.id=s.hostId  WHERE  s.sessionChannelId = ?  AND u.status = 1 AND u.type = 1  AND s.status = 1 AND s.isTutorialRead = 1 AND s.isCompleted = 0 AND s.scheduleDate IS NOT NULL  ORDER BY s.scheduleDate ASC', [sessionChannelId], function (error, results, fields) {
			  if (error) reject(error);
			 //  console.log('================== results ', error)
			  return resolve(results);
			});
		});
		}else{
			return await new Promise((resolve, reject) => {
				db.query('SELECT count(s.id) as total FROM sessions s  WHERE  s.sessionChannelId = ?  AND s.status = 1  AND s.isTutorialRead = 2 AND s.isCompleted > 0 AND s.scheduleDate IS NOT NULL   ORDER BY s.scheduleDate ASC ', [sessionChannelId], function (error, results, fields) {
				  if (error) reject(error);
				 //  console.log('================== results ', error)
				  // db.end();
				  return resolve(isEmpty(results) ? '' : results[0]);
				});
			});

		}
	}


	/**
	 * Get next session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getNextSessionByHostId(userId,sessionChannelId) {
		console.log('-----userId,sessionChannelId------------',userId,sessionChannelId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id,  s.name,s.scheduleDate,s.duration,s.description FROM sessions s LEFT JOIN session_users su ON su.sessionId = s.id  WHERE su.userId = ?  AND s.sessionChannelId = ?  AND su.hostStatus = 1 AND s.isCompleted = 0 AND su.status = 1 AND s.status = 1  AND s.scheduleDate IS NOT NULL AND s.scheduleDate >  NOW()  ORDER BY s.scheduleDate ASC LIMIT 1', [userId,sessionChannelId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}


	/**
	 * Get next session
	 * @param  {int} interestId 
	 * @return {obj} 
	 */
	async getNextSessionByInterestId(interestId,sessionChannelId) {
		console.log('-----interestId,sessionChannelId------------',interestId,sessionChannelId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id, s.name,s.hostId,s.scheduleDate,s.duration,s.description FROM sessions s  WHERE s.interestId = ?  AND  s.sessionChannelId = ?  AND s.status = 1  AND s.isCompleted = 0 AND s.scheduleDate IS NOT NULL AND s.scheduleDate >  NOW()  ORDER BY s.scheduleDate ASC', [interestId,sessionChannelId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}



		/**
	 * Get upcomming session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getUpcommingSession(userId,type) {
        return await new Promise((resolve, reject) => {
			let hostStatus ='';
		if(type == 1)
		{
			let hostStatus1 = 1;
			hostStatus=hostStatus1;

		}else{
			let hostStatus2 = 0;
			hostStatus=hostStatus2;
		}
        	//db.query('SELECT s.id,s.name,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.scheduleDate,s.duration,s.description, su.sessionId, ch.image as channelImage, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  WHERE su.userId = ?  AND su.type = ?  AND su.hostStatus = '+hostStatus+'  AND su.status = 1 AND su.sessionStatus < 2  AND s.status = 1  AND s.isCompleted = 0 AND sess.status = 1  AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() - INTERVAL sess.duration MINUTE )  ORDER BY s.scheduleDate ASC LIMIT 1', [userId,type], function (error, results, fields) {		
				db.query('SELECT s.id,s.name,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.scheduleDate,s.duration,s.description, su.sessionId, su.hostStatus, ch.image as channelImage, su.userId, su.type FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  INNER JOIN channels ch ON ch.id = s.sessionChannelId  WHERE su.userId = ?  AND su.status = 1 AND su.sessionStatus < 2  AND s.status = 1  AND s.isCompleted = 0 AND sess.status = 1 AND((su.type = 2 AND su.hostStatus = 0) OR (su.type = 1 AND su.hostStatus = 1)) AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() - INTERVAL sess.duration MINUTE )  ORDER BY s.scheduleDate ASC LIMIT 1', [userId], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('================== results11111 ', results)
			  // db.end();	
			  return resolve(results);
			  
			});
        });
	}


	async getnextSessionAfterthirtyMinute(userId,timeDuration,prevsessionEndTime,type) {
		//console.log('-----userId,timeDuration----------',userId,timeDuration)

		let hostStatus ='';
		if(type == 1)
		{
			let hostStatus1 = 1;
			hostStatus=hostStatus1;

		}else{
			let hostStatus2 = 0;
			hostStatus=hostStatus2;
		}
        return await new Promise((resolve, reject) => {
        	//	db.query('SELECT s.id, s.name,s.isTutorialRead,s.isTutorialStart,s.isCompleted,s.isSessionRejoined,s.scheduleDate,s.duration,s.description, s.image as sessionImage, su.sessionId,ch.image as channelImage, su.userId, su.type FROM sessions s  LEFT JOIN session_users su ON su.sessionId = s.id INNER JOIN channels ch ON ch.id = s.sessionChannelId  WHERE  su.userId = ?  AND su.type = ? AND su.hostStatus = '+hostStatus+' AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1  AND s.isCompleted = 0  AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() + INTERVAL '+prevsessionEndTime+' MINUTE ) AND s.scheduleDate < ( NOW() + INTERVAL '+timeDuration+' MINUTE )ORDER BY s.scheduleDate ASC LIMIT 1', [userId,type], function (error, results, fields) {	
			db.query('SELECT s.id, s.name,s.isTutorialRead,s.isTutorialStart,s.isCompleted,s.isSessionRejoined,s.scheduleDate,s.duration,s.description, s.image as sessionImage, su.sessionId,su.hostStatus,ch.image as channelImage, su.userId, su.type FROM sessions s  LEFT JOIN session_users su ON su.sessionId = s.id INNER JOIN channels ch ON ch.id = s.sessionChannelId  WHERE  su.userId = ?   AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1  AND s.isCompleted = 0 AND((su.type = 2 AND su.hostStatus = 0) OR (su.type = 1 AND su.hostStatus = 1)) AND s.scheduleDate IS NOT NULL AND s.scheduleDate > ( NOW() + INTERVAL '+prevsessionEndTime+' MINUTE ) AND s.scheduleDate < ( NOW() + INTERVAL '+timeDuration+' MINUTE )ORDER BY s.scheduleDate ASC LIMIT 1', [userId], function (error, results, fields) {	
			  if (error) reject(error);
			   //console.log('================== results111111 ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	
	async getsessionExistAfter30Min(userId) {
		//console.log('-----userId,timeDuration----------',userId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id FROM sessions s  LEFT JOIN session_users su ON su.sessionId = s.id  WHERE  su.userId = ? AND su.type = 2 AND s.status = 1  AND s.scheduleDate IS NOT NULL  AND  s.sessionEndDate > UTC_TIMESTAMP() AND  s.scheduleDate < ( UTC_TIMESTAMP() + INTERVAL 30 MINUTE )  AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 ORDER BY s.scheduleDate ASC', [userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
        });
	}



	async getsessionExist(userId,sessionStartTime,sessionEndTime,type) {
		console.log('-----userId,timeDuration----------',userId,sessionStartTime)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id FROM sessions s  LEFT JOIN session_users su ON su.sessionId = s.id  WHERE  su.userId = ? AND su.type = ? AND s.status = 1  AND s.scheduleDate IS NOT NULL AND ((s.scheduleDate <= "'+sessionStartTime+'"  AND s.sessionEndDate >= "'+sessionStartTime+'") OR  (s.scheduleDate <= "'+sessionEndTime+'"  AND s.sessionEndDate >= "'+sessionEndTime+'") OR  (s.scheduleDate >= "'+sessionStartTime+'"  AND s.sessionEndDate <= "'+sessionEndTime+'"))  AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 ORDER BY s.scheduleDate ASC', [userId,type], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	async getsessionExistAtSameTime(userId,sessionStartTime,sessionEndTime) {
		console.log('-----userId,timeDuration----------',userId,sessionStartTime)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.id FROM sessions s  LEFT JOIN session_users su ON su.sessionId = s.id  WHERE  su.userId = ?  AND s.status = 1  AND s.scheduleDate IS NOT NULL AND ((s.scheduleDate <= "'+sessionStartTime+'"  AND s.sessionEndDate >= "'+sessionStartTime+'") OR  (s.scheduleDate <= "'+sessionEndTime+'"  AND s.sessionEndDate >= "'+sessionEndTime+'") OR  (s.scheduleDate >= "'+sessionStartTime+'"  AND s.sessionEndDate <= "'+sessionEndTime+'"))  AND s.isCompleted = 0 AND su.status = 1 AND su.sessionStatus < 2 ORDER BY s.scheduleDate ASC', [userId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	/**
	 * Get upcomming session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async individualSessDetail(sessionId,userId) {
        return await new Promise((resolve, reject) => {
        	//db.query('SELECT s.*, i.code, su.sessionId, su.userId, su.type, u.firstName as hostFirstName, u.lastName as hostLastName, u.email as hostEmail, u.image as hostImage FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id JOIN users u ON u.id = s.hostId LEFT JOIN interest i ON i.id = s.interestId WHERE su.userId = ? AND sess.id = ? AND su.status = 1 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL ', [userId,sessionId], function (error, results, fields) {
			db.query('SELECT s.id,s.interestId,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,ch.image as channelImage, su.sessionId, su.userId, su.type  FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId  INNER JOIN channels ch ON ch.id = s.sessionChannelId WHERE su.userId = ? AND sess.id = ? AND su.status = 1 AND su.sessionStatus < 2 AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL ', [userId,sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	async individualSessDetailForAdm(sessionId,userId) {
        return await new Promise((resolve, reject) => {
			db.query('SELECT s.id,s.interestId,su.sessionStatus as sessionStatus,s.groupId,s.isTutorialRead,s.isTutorialStart,s.isSessionRejoined,s.isCompleted,s.sessionChannelId,s.hostId as sessionCreatorId,s.name,s.scheduleDate,s.duration,s.description,s.createdAt,s.status,s.charges,s.channelId,s.rtmChannelId,s.hostReminder,s.participantReminder,s.cutOffTime,s.level,s.currency,s.chargeForSession,s.sessionChargeAllowed,s.allowParticipantDMOthers,s.participantDisableDM,s.minNotMetNoticeTime,s.image,s.video,s.minAttendee,s.maxAttendee,s.logo,s.displayScript,s.showParticipantsCount,s.participantsPickPlaylist,s.showParticipantsPicToOtherPartcipants,s.allowGroupLocation,s.activity,s.heartRateMonitor,s.zoneTracking,s.sessionProperty,s.onDemand,s.sessionLink,s.orderWine,s.sessionEndDate, i.code,ch.image as channelImage, su.sessionId, su.userId, su.type  FROM sessions s INNER JOIN sessions sess on sess.id=s.id LEFT JOIN session_users su ON su.sessionId = s.id  LEFT JOIN interest i ON i.id = s.interestId  INNER JOIN channels ch ON ch.id = s.sessionChannelId WHERE su.userId = ? AND sess.id = ?  AND s.status = 1 AND sess.status = 1 AND sess.scheduleDate IS NOT NULL AND s.scheduleDate IS NOT NULL ', [userId,sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	/**
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findSessionDetail(sessionId, userId) {
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.type, su.sessionType, su.userId, ac.appId, ac.appCertificate FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId LEFT JOIN agora_config ac ON ac.id = s.configId WHERE su.status = 1 AND su.sessionId = ? AND su.userId = ?', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  //return resolve(results[0]);
			  return resolve(results);
			});
        });
	}



		/**
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getSessionDetailDTA(sessionId, userId) {
		
        return await new Promise((resolve, reject) => {
                	db.query('SELECT s.*, su.type, su.sessionType, su.userId  FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId  WHERE su.status = 1 AND su.sessionId = ? AND su.userId = ?', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('=======lalittiwari=========== ************ results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);

			});
        });
	}



	 /**
	 * Get session detail by sessionId and user id
	 * @param  {int} sessionId 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findSessionDetail1(sessionId, userId) {

		//console.log('-----sessionId, userId----------',sessionId, userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.type, su.sessionType, su.userId,u.firstName,u.email  FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId INNER JOIN users u ON u.id=su.userId  WHERE su.status = 1 AND su.sessionId = ? AND su.userId = ?', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('=======lalittiwari=========== ************ results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);

			});
        });
	}

	/**
	 * Get session detail by user id
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findByUserId(userId){

	    let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE hostId = ? AND status = 1', [table, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	/**
	 * Get All session session of single user
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findAllSessionById(userId){
        return await new Promise((resolve, reject) => {
        	db.query('SELECT s.*, su.type, su.sessionType FROM session_users su LEFT JOIN sessions s ON s.id = su.sessionId WHERE su.status = 1 AND su.userId = ?', [userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}	

	async findSessionDetailBySessId(sessionId){
// console.log('-----sessID----------',sessionId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT  u.firstName, u.lastName, u.email,ch.name as channelName, ses.* FROM sessions ses INNER JOIN users u ON u.id = ses.hostId INNER JOIN channels ch ON ch.id = ses.sessionChannelId WHERE u.isBanned = 0 AND ses.status = 1 AND ses.id = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			// console.log('===========sessionId======= ************ results ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
        });
	}


	async getSessionDetailBySessionId(sessionId){
		// console.log('-----sessID----------',sessionId)
				return await new Promise((resolve, reject) => {
					db.query('SELECT id,name,timeZone,scheduleDate,sessionEndDate,duration,maxAttendee FROM sessions  WHERE  status = 1 AND id = ?', [sessionId], function (error, results, fields) {
					  if (error) reject(error);
					// console.log('===========sessionId======= ************ results ', error)
					  // db.end();
					  return resolve(isEmpty(results) ? '' : results[0]);
					});
				});
			}

	async updateSessionDetailBySessId(sessionId,urlcode){
		// console.log('-----sessID----------',sessionId,urlcode)
		 let table = this.table;
		return await new Promise((resolve, reject) => {            
        	db.query('UPDATE ?? SET sessionLink = "'+urlcode+'"  WHERE id = ?  AND status = 1', [table,sessionId], function (error, results, fields) {
                if (error) reject(error);
                //console.log('----------sessionLink------------------',error)
                return resolve(results.affectedRows);
              });
		});
	}

	async updateSessionHostBySessId(sessionId,userId){
		// console.log('-----sessID----------',sessionId,urlcode)
		 let table = this.table;
		return await new Promise((resolve, reject) => {            
        	db.query('UPDATE ?? SET hostId = "'+userId+'"  WHERE id = ?  AND status = 1', [table,sessionId], function (error, results, fields) {
                if (error) reject(error);
                //console.log('----------sessionLink------------------',error)
                return resolve(results.affectedRows);
              });
		});
	}

	async findSessionUsers(sessionId){

        return await new Promise((resolve, reject) => {
        	db.query('SELECT u.id, u.firstName, u.lastName, u.email, u.image, u.address1, u.address2, u.city, u.state, u.zip, su.type as userType, su.hostStatus,su.sessionStatus FROM session_users su LEFT JOIN users u ON u.id = su.userId WHERE u.isBanned = 0 AND su.status = 1 AND su.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	async getSessionAgoraConfig(sessionId){
		return await new Promise((resolve, reject) => {
        	db.query('SELECT ac.* FROM agora_config ac LEFT JOIN session_config_mapping acm ON ac.id = acm.configId WHERE ac.status = 1 AND acm.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  //console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}


	async getAgoraConfig(){
		return await new Promise((resolve, reject) => {
        	db.query('SELECT ac.* FROM agora_config ac  WHERE ac.status = 1 AND ac.type = 1 AND ac.id = 2', [], function (error, results, fields) {
			  if (error) reject(error);
			//  console.log('================== ************ results ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
        });
	}


		/**
	 * Check for duplicate session name for the same host
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async checkDuplicateSession(userId, sessionName) {
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id FROM ?? WHERE hostId = ? AND name = ? AND status = 1', [this.table, userId, sessionName], function (error, results, fields) {
				  if (error) reject(error);
				  
				  return resolve(results);

			});
        });
	}

			/**
	 * Check for duplicate session name for the same host
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async checkDuplicateSessionAtTime(userId, currentDate,endDate) {
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id FROM ?? WHERE hostId = ? AND s.scheduleDate >= ?  AND s.scheduleDate <= ? AND status = 1', [this.table, userId, currentDate,endDate], function (error, results, fields) {
				  if (error) reject(error);
				  
				  return resolve(results);

			});
        });
	}

	/**
	 * Check for duplicate session name for the same host
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	// async getSessionScheduleDate(userId, currentDate,endDate) {
    //     return await new Promise((resolve, reject) => {
    //     	db.query('SELECT * FROM ?? WHERE hostId = ? AND sessionEndDate >= ?  AND isTutorialRead = 0 AND status = 1', [this.table, userId, currentDate], function (error, results, fields) {
	// 			  if (error) reject(error);
				  
	// 			  return resolve(results);

	// 		});
    //     });
	// }
	//columname >='2012-12-25 00:00:00'AND columname <='2012-12-26 00:00:00'

	async getSessionScheduleDate(userId, currentDate,endDate) {

		console.log('---------userId, currentDate,endDate-------------',userId, currentDate,endDate)

        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,name,scheduleDate,sessionEndDate,isCompleted FROM ?? WHERE hostId = ? AND ((scheduleDate <= "'+currentDate+'"  AND sessionEndDate >= "'+currentDate+'") OR  (scheduleDate <= "'+endDate+'"  AND sessionEndDate >= "'+endDate+'") OR  (scheduleDate >= "'+currentDate+'"  AND sessionEndDate <= "'+endDate+'"))   AND isTutorialRead = 0  AND isCompleted = 0 AND status = 1 LIMIT 1', [this.table, userId], function (error, results, fields) {
				  if (error) reject(error);
				  console.log('---------error1-------------',error)
				  return resolve(results);

			});
        });
	}

	async getSameSessionSchedule(userId, currentDate,endDate,sessionId) {

		console.log('---------userId, currentDate,endDate-------------',userId, currentDate,endDate)

        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,name,scheduleDate,sessionEndDate,isCompleted FROM ?? WHERE hostId = ? AND ((scheduleDate <= "'+currentDate+'"  AND sessionEndDate >= "'+currentDate+'") OR  (scheduleDate <= "'+endDate+'"  AND sessionEndDate >= "'+endDate+'") OR  (scheduleDate >= "'+currentDate+'"  AND sessionEndDate <= "'+endDate+'"))   AND isTutorialRead = 0  AND isCompleted = 0  AND id != "'+sessionId+'" AND status = 1 LIMIT 1', [this.table, userId], function (error, results, fields) {
				  if (error) reject(error);
				  console.log('---------error1-------------',error)
				  return resolve(results);

			});
        });
	}

	/**
	 * Get ost AllProduct By Host Id 
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findAllProductByHost(userId) {

		//console.log('-----sessionId, userId----------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ss.*  FROM session_script ss  WHERE ss.status = 1 AND userId = ?' , [userId], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('=======lalittiwari123=========== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}

	/**
	 * Insert new session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async findAllPrevSessionByChannel(channelId){
        return await new Promise((resolve, reject) => {
        	db.query('SELECT u.firstName as hostName,c.name as channelName,s.* FROM session_users su INNER JOIN sessions s ON s.id = su.sessionId LEFT JOIN users u ON u.id = su.userId LEFT JOIN channel_host ch ON ch.hostId= su.userId LEFT JOIN channels c ON c.userId = ch.channelAdmin   WHERE ch.channelId = ? group by s.id', [channelId], function (error, results, fields) {
			  if (error) reject(error);			  
			  return resolve(results);
			});
        });
	}

	/**
	 * Insert new session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getSession(){
		let table=this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ??  WHERE status = 1 ORDER BY id DESC LIMIT 1', [table], function (error, results, fields) {
			  if (error) reject(error);			  
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
        });
	}
	
	async add(data){
		//console.log('============output====== ************ results ',this.table, data)
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET interestId=?,groupId=?,sessionChannelId=?,channelId=?,rtmChannelId=?, name=?, description=?, hostId=?, scheduleDate=?, duration=?, sessionEndDate=?, level=?, minAttendee=?, maxAttendee=?, currency=?, chargeForSession=?,sessionChargeAllowed=?, showParticipantsCount=?, hostReminder=?, participantReminder=?, cutOffTime=?, minNotMetNoticeTime=?,displayScript=?, participantDisableDM=?, participantsPickPlaylist=?, showParticipantsPicToOtherPartcipants=?, allowGroupLocation=?, activity=?, heartRateMonitor=?, zoneTracking=?,sessionProperty=?,onDemand=?,orderWine=?, isTutorialRead=?,isTutorialStart=?,charges=?,timeZone=?,status=1', [
						this.table,
						data.interestId,
						data.groupId,
						data.sessionChannelId,
						data.channelId,
						data.rtmChannelId,
						data.name, 
						data.description, 
						data.hostId,
						data.scheduleDate,
						data.duration,
						data.sessionEndDate,
						data.level,
						data.minAttendee,
						data.maxAttendee,
						data.currency,
						data.chargeForSession,
						data.sessionChargeAllowed,
						data.showParticipantsCount,
						data.hostReminder,
						data.participantReminder,
						data.cutOffTime,
						data.minNotMetNoticeTime,
						data.displayScript,
						data.participantDisableDM,
						data.participantsPickPlaylist,
						data.showParticipantsPicToOtherPartcipants,
						data.allowGroupLocation,
						data.activity,
						data.heartRateMonitor,
						data.zoneTracking,
						data.sessionProperty,
						data.onDemand,
						data.orderWine,
						data.isTutorialRead,						
						data.isTutorialStart,
						data.charges,
						data.timeZone
						], function (error, results, fields) {

			  if (error) //reject(error);

			  console.log('==========lalitErr======== ************ results ', error)

			if(error != null)
			{
				console.log('==========lalitErr11111======== ************ results ', error.sqlMessage)
				return resolve(error.sqlMessage);
			}
			 else{
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			 }
			});
		});
	}

	async updateSession(data,sessionId){
		//console.log('============output====== ************ results ',this.table, data,sessionId)
		return await new Promise((resolve, reject) => {
			db.query('UPDATE  ?? SET interestId=?,groupId=?,sessionChannelId=?,channelId=?,rtmChannelId=?, name=?, description=?, hostId=?, scheduleDate=?, duration=?, sessionEndDate=?, level=?, minAttendee=?, maxAttendee=?, currency=?, chargeForSession=?,sessionChargeAllowed=?, showParticipantsCount=?, hostReminder=?, participantReminder=?, cutOffTime=?, minNotMetNoticeTime=?,displayScript=?, participantDisableDM=?, participantsPickPlaylist=?, showParticipantsPicToOtherPartcipants=?, allowGroupLocation=?, activity=?, heartRateMonitor=?, zoneTracking=?,sessionProperty=?,onDemand=?,orderWine=?,charges=?, status=1 WHERE id = ?', [
						this.table,
						data.interestId,
						data.groupId,
						data.sessionChannelId,
						data.channelId,
						data.rtmChannelId, 
						data.name, 
						data.description, 
						data.hostId,
						data.scheduleDate,
						data.duration,
						data.sessionEndDate,
						data.level,
						data.minAttendee,
						data.maxAttendee,
						data.currency,
						data.chargeForSession,
						data.sessionChargeAllowed,
						data.showParticipantsCount,
						data.hostReminder,
						data.participantReminder,
						data.cutOffTime,
						data.minNotMetNoticeTime,
						data.displayScript,
						data.participantDisableDM,
						data.participantsPickPlaylist,
						data.showParticipantsPicToOtherPartcipants,
						data.allowGroupLocation,
						data.activity,
						data.heartRateMonitor,
						data.zoneTracking,
						data.sessionProperty,
						data.onDemand,
						data.orderWine,
						data.charges,
						sessionId
						], function (error, results, fields) {
			  if (error) //reject(error);
			  console.log('==========lalitErr======== ************ results ', error)
			  return resolve(isEmpty(results) ? 0 : results.affectedRows);

			  if(error != null)
			  {
				  return resolve(error.sqlMessage);
			  }
			   else{
				return resolve(isEmpty(results) ? 0 : results.affectedRows);
			   }
			});
		});
	}

		/**
	 * Insert new session
	 * @param  {int} sessionId 
	 * @return {obj} 
	 */
	async sessionUserExist(sessionId,userId){
		let table=this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM session_users  WHERE  sessionId = ? AND userId = ?  AND status = 1 ORDER BY id ASC', [sessionId,userId], function (error, results, fields) {
			  if (error) reject(error);			  
			  return resolve(results);
			});
        });
	}


			/**
	 * Insert new session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getdefaultSessionStatus(userId){
		let table=this.table;

        return await new Promise((resolve, reject) => {
        	// db.query('SELECT * FROM ??  WHERE   hostId = ?  AND isTutorialRead = 2  AND status = 1 ORDER BY id ASC ', [table,userId], function (error, results, fields) {

				db.query('SELECT * FROM ??  WHERE   hostId = ?  AND isTutorialRead != 0  AND status = 1 ORDER BY id ASC ', [table,userId], function (error, results, fields) {

			  if (error) reject(error);			  
			  return resolve(results);
			});
        });
	}

	/**
	 * Insert new session
	 * @param  {int} sessionId 
	 * @return {obj} 
	 */
	async updateSessionCompletedStatus(userId, sessionId){

		let table = this.table;

        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET isCompleted = 1 WHERE id = ? AND hostId = ? ', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);	
	  
			  return resolve(results.affectedRows);
			});
        });
	}

	/**
	 * Insert new session
	 * @param  {int} sessionId 
	 * @return {obj} 
	 */
	async updateSessionCancelStatus(userId, sessionId){

		let table = this.table;

        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET isCompleted = 2 WHERE id = ? AND hostId = ? ', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);	
	  
			  return resolve(results.affectedRows);
			});
        });
	}



	/**
	 * Insert new session
	 * @param  {int} sessionId 
	 * @return {obj} 
	 */
	async updateSessionIsDefaultTutorialStartStatus(sessionId){
		let table=this.table;
		console.log('-----------sessionId11111-------------',sessionId)
        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET isTutorialStart = 2  WHERE  id = ?  AND status = 1 ', [table,sessionId], function (error, results, fields) {
			  if (error) reject(error);	
			  console.log('--------:results1111-------------',results)		  
			  return resolve(results.affectedRows);
			});
        });
	}

	async getSessionDetailBySessId(sessionId){
		console.log('-----sessID----------',sessionId)
				return await new Promise((resolve, reject) => {
					db.query('SELECT ses.* FROM sessions ses WHERE ses.status = 1 AND ses.id = ? AND ses.sessionEndDate < UTC_TIMESTAMP()', [sessionId], function (error, results, fields) {
					  if (error) reject(error);
					 console.log('===========sessionId======= ************ results ', results)
					  // db.end();
					  return resolve(isEmpty(results) ? '' : results);
					});
				});
			}

	/**
	 * Insert new session
	 * @param  {int} sessionId 
	 * @return {obj} 
	 */
	async updateNewDefaultSession(sessionId,currentDate,endDate,duration){
		let table=this.table;
		console.log('-----------sessionId11111-------------',sessionId)
        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET scheduleDate = ?, sessionEndDate = ? , duration = ?  WHERE  id = ?  AND status = 1 ', [table,currentDate,endDate,duration,sessionId], function (error, results, fields) {
			  if (error) reject(error);	
			  console.log('--------:results1111-------------',results)		  
			  return resolve(results.affectedRows);
			});
        });
	}

	async updateSessionIsTutorialStatus(sessionId){
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET isTutorialRead = 2  WHERE  id = ?  AND status = 1 ', [table,sessionId], function (error, results, fields) {
			  if (error) reject(error);	
			  return resolve(results.affectedRows);
			});
		});
	}

	async updateSessionTutorialStatus(sessionId){
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET isTutorialRead = 2 ,isCompleted = 1 WHERE  id = ?  AND status = 1 ', [table,sessionId], function (error, results, fields) {
			  if (error) reject(error);	
			  return resolve(results.affectedRows);
			});
		});
	}

	async getSessionByUserId(userId){
		console.log('-----sessID----------',userId)
				return await new Promise((resolve, reject) => {
					db.query('SELECT ses.* FROM sessions ses WHERE ses.status = 1 AND ses.hostId = ? AND isTutorialRead > 0', [userId], function (error, results, fields) {
					  if (error) reject(error);
					 console.log('===========sessionId======= ************ results ', results)
					  // db.end();
					  return resolve(isEmpty(results) ? '' : results);
					});
				});
			}


			async getSessionHostDetail(sessionId){

				return await new Promise((resolve, reject) => {
					db.query('SELECT u.id, u.firstName, u.lastName, u.email, su.type as userType, su.hostStatus,su.sessionStatus FROM session_users su LEFT JOIN users u ON u.id = su.userId WHERE u.isBanned = 0 AND su.status = 1 AND su.hostStatus = 1 AND su.sessionId = ?', [sessionId], function (error, results, fields) {
					  if (error) reject(error);
					  console.log('================== ************ results ', error)
					  // db.end();
					  return resolve(isEmpty(results) ? '' : results);
					});
				});
			}

	/*check member in member table and related with session id */
	async isMember(sessionId,userId){
		let table=this.table;
		return await new Promise((resolve, reject) => {
			db.query('SELECT *  FROM member mm INNER JOIN users us on mm.email = us.email WHERE us.id = ? and mm.channelId=(select sessionChannelId from sessions where id=?) and mm.status = 1', [userId,sessionId], function (error, results, fields) {
			  if (error) reject(error);	
			//   console.log('=MMMMMMMMM====== ************ results ', results,error)		  
			  return resolve(results);
			});
		});
	}

	/*check memberBY EMAIL member table and related with session id */
	async checkMemberByEmail(emailId,channelId){
		let table=this.table;
		return await new Promise((resolve, reject) => {
			db.query('SELECT * FROM member where email =? AND channelId=? AND status=1', [emailId,channelId], function (error, results, fields) {
			  if (error) reject(error);	
			//   console.log('=EMAILLL====== ************ results ', results)		  
			  return resolve(results);
			});
		});
	}

	/*check memberBY EMAIL member table and related with session id */
	async getchannelIdBysessionId(sessionId){
		let table=this.table;
		return await new Promise((resolve, reject) => {
			db.query('SELECT sessionChannelId FROM sessions WHERE id=? and isCompleted=0', [sessionId], function (error, results, fields) {
			  if (error) reject(error);	
			//   console.log('=CHANNEL ID********** results ', results)		  
			  return resolve(results);
			});
		});
	}
	
	


}

module.exports = new Session();

