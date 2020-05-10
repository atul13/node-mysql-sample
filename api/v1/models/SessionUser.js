const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class SessionUser{

	constructor(){
		this.table = 'session_users';
	}

	/**
	 * Get session user detail
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findById(userId){
	    let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE userId = ? AND status = 1', [table, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}

	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async findByStreamUser(sessionId, userId){
		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE sessionId = ? AND userId = ? AND status = 1', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results[0]);
			});
        })
	}


	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async getSessionHost(sessionId){
		let table = this.table;
		console.log('--------sessionId1111111--------------',sessionId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT u.id as hostId,u.firstName as hostFirstName, u.lastName as hostLastName, u.email as hostEmail, u.image as hostImage FROM  session_users su INNER JOIN users u ON u.id = su.userId WHERE su.sessionId = ?   AND  su.type = 1  AND  su.hostStatus = 1 ', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}


	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async getTotalSignup(sessionId){
		let table = this.table;
	//	console.log('--------sessionId--------------',sessionId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT su.userId,u.firstName,u.lastName,su.sessionStatus, u.email FROM  session_users su  INNER JOIN users u ON u.id = su.userId  WHERE  su.sessionId = ?  AND  su.type = 2  AND  su.status = 1 AND  u.status = 1  AND  u.isOtpVerified = 1  GROUP BY  su.userId', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}


	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async getSessionUser(sessionId,userId,type){
		let table = this.table;
		//console.log('--------sessionId1111111--------------',sessionId,userId,type)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT su.id FROM  session_users su  WHERE su.sessionId = ? AND  su.userId = ? ', [sessionId,userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}


		/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async getSessionExistingHost(sessionId,userId){
		let table = this.table;
		console.log('--------sessionUserId1111111--------------',sessionId,userId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT su.id,su.hostStatus FROM  session_users su  WHERE su.sessionId = ? AND  su.userId = ?  AND  su.type = 1   AND  su.status = 1 ORDER BY su.id DESC', [sessionId,userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}

	/**
	 * Update session user with current running session
	 * @param  {int} userId 
	 * @param  {int} sessionId
	 * @param  {int} flag
	 * @return {obj} 
	 */
	async updateCurrentSessionType(userId, sessionId, flag){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {

			db.query('UPDATE ?? SET sessionType = ? WHERE sessionId = ? AND userId = ?', [table, flag, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}

	/**
	 * Update joined session user detail
	 * @param  {int} userId
	 * @param  {int} sessionId
	 * @param  {int} streamId
	 * @param  {int} type
	 * @return {obj} 
	 */
	async updateConferenceUser(userId, sessionId, streamId){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {
			db.query('UPDATE ?? SET streamId = ? WHERE sessionId = ? AND userId = ?', [table, streamId, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}

		/**
	 * Update joined session status
	 * @param  {int} userId
	 * @param  {int} sessionId
	 * @return {obj} 
	 */

	async updateSessionUser(userId, sessionId){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {
			db.query('UPDATE ?? SET sessionStatus = 1 WHERE sessionId = ? AND userId = ?', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}

	async updatejoinSessionUser(userId, sessionId){

	    let table = this.table;
		
		return await new Promise( (resolve, reject) => {
			db.query('UPDATE ?? SET sessionStatus = 0 WHERE sessionId = ? AND userId = ?', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== 123 results ', results)
			  // db.end();
			  return resolve(results);
			});
		});
	}


	/**
	 * Insert New session User
	 * @param  {int} userId
	 * @param  {int} sessionId
	 * @return {obj} 
	 */
	async addSessionUser(sessionId,userId) {
        let table = this.table;
        console.log('----------sessionId2222------------------',sessionId,table,userId)
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET sessionId=?, userId=?, type=1, hostStatus=1, status=1', 
					[
						table,
						sessionId, 
						userId
					], function (error, results, fields) {
			  if (error) reject(error);
			 // console.log('----------resultsessionuser------------------',error)
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	async addSessionAnotherhost(data) {
		
        let table = this.table;

        console.log('----------sessionId2222------------------',data)

        //data to be inserted into table
  
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (sessionId, userId,type,hostStatus,status,member) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

               // console.log('----------sessionuser------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

	async updateSessionAnotherhost(data) {
        let table = this.table;

      //  console.log('----------sessionId2222------------------',data)

        //data to be inserted into table
  
		return await new Promise((resolve, reject) => {
            
        //	db.query('UPDATE  ?? SET status = 0 where  sessionId = ? AND  type = 1 AND status = 1', [table, data], function (error, results, fields) {

				db.query('UPDATE  ?? SET hostStatus = 0 where  sessionId = ? AND  type = 1 AND status = 1', [table, data], function (error, results, fields) {			
                if (error) reject(error);

              //  console.log('----------sessionuser------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

	async updatedSessionhost(data) {
        let table = this.table;

       // console.log('----------sessionId2222------------------',data)

        //data to be inserted into table
  
		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE  ?? SET hostStatus = 0 where  sessionId = ? AND  type = 1 AND status = 1', [table, data], function (error, results, fields) {

                if (error) reject(error);

               // console.log('----------sessionuser------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}


	async updatedSessionhostData(sessionId,userId) {
        let table = this.table;

        //console.log('----------sessionId2222------------------',sessionId,userId)

        //data to be inserted into table
  
		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE  ?? SET hostStatus = 1 where  sessionId = ?  AND userId = ? AND  type = 1 AND status = 1', [table, sessionId,userId], function (error, results, fields) {

                if (error) reject(error);

              //  console.log('----------sessionuser------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

	/**
	 * Get current running session detail
	 * @param  {int} sessionId 
	 * @param  {int} userId
	 * @return {obj} 
	 */
	async getUsermemToThisSession(sessionId,userId){
		let table = this.table;
		console.log('--------sessionUserId1111111--------------',sessionId,userId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT su.id,su.type  FROM  session_users su  WHERE su.sessionId = ? AND  su.userId = ?   AND  su.status = 1  ORDER BY su.id DESC LIMIT 1', [sessionId,userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== error ', error)
			   console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}

	async getUserSignupToSession(sessionId,userId){
		let table = this.table;
		console.log('--------sessionUserId1111111--------------',sessionId,userId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT su.id,su.type,su.status,su.sessionStatus FROM  session_users su  WHERE su.sessionId = ? AND  su.userId = ?  ORDER BY su.id DESC LIMIT 1', [sessionId,userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== error ', error)
			   console.log('================== results ', results)
			  return resolve(results);
			});
        })
	}

	/**
	 * Insert new session
	 * @param  {int} sessionId 
	 * @return {obj} 
	 */
	async updateSessionActiveStatus(sessionId,userId){

		let table = this.table;

        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET status = 1 , sessionStatus = 0  WHERE sessionId = ? AND userId = ? ', [table, sessionId, userId], function (error, results, fields) {
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
	async updateSessionCancelStatusByParticipant(userId, sessionId){

		let table = this.table;

        return await new Promise((resolve, reject) => {
        	db.query('UPDATE ?? SET sessionStatus = 2  WHERE sessionId = ? AND userId = ? ', [table, sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);	
	  
			  return resolve(results.affectedRows);
			});
        });
	}

}

module.exports = new SessionUser();