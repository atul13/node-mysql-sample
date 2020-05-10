const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class Newsletter{

	// constructor(){
	// 	this.table = 'tbl_newsletter';
	// }

	/**
	 * add new record
	 * @param {obj} newsletterData
	 */
	async addnewsletter(newsletterData) {
		let table = 'tbl_newsletter';
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET name=?,email=?,intrest=?,others=?,hptype=?,source=?', [table,newsletterData.name,newsletterData.email,newsletterData.intrest, newsletterData.others,newsletterData.hostType,newsletterData.source], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('===MNMOHAN====== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	/**
	 * add new record
	 * @param {obj} inviteData
	 */
		async addinvite(inviteData) {
		console.log('================== inviteData ', inviteData)
		let table = 'tbl_invite';
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET email=?, invite_code=?', [table,inviteData.email, inviteData.invite_code, inviteData.others], function (error, results, fields) {
			  if (error)
				   return Promise.reject(new Error("Whoops!"));
			  else
				  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		}).catch((error) => {
			assert.isNotOk(error,'Promise error');
			done();
		  });
	}

	/**CHECK INVITE CODE IN EXITS OR NOT */
	async getInvite(inviteCode) {
		let table = 'tbl_invite';
		return await new Promise((resolve, reject) => {
			db.query('SELECT email,invite_code,status FROM ?? WHERE invite_code= ? AND status=1', [table,inviteCode], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
		});
	}

	/****THIS METHOD IS USED FOR SESSION DATA FOR EMAIL NOTIFICATION */



	async findSessionUsersParticipant(sessionId){

        return await new Promise((resolve, reject) => {
        	db.query('SELECT DISTINCT u.email, u.firstName, tmp.sl, tmp.hml, tmp.hostfName, tmp.sd FROM session_users su LEFT JOIN users u ON u.id = su.userId LEFT JOIN (select ss.id as ids, ss.sessionLink as sl, ss.hostId as hid, ur.email as hml, ur.firstName as hostfName, ss.scheduleDate as sd FROM sessions as ss left join users as ur on ur.id = ss.hostId) as tmp on tmp.ids = su.sessionId WHERE su.status = 1 AND su.sessionStatus=0 AND su.hostStatus=0 AND u.type=2 AND su.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}


	async findSessionUsersHost(sessionId){

        return await new Promise((resolve, reject) => {
        	db.query('SELECT DISTINCT u.email,u.id, u.firstName, su.type as userType, su.hostStatus,su.sessionStatus,s.sessionLink FROM session_users su LEFT JOIN users u ON u.id = su.userId LEFT JOIN sessions s on s.hostId=u.id WHERE su.status = 1 AND su.sessionStatus=0 AND su.hostStatus=1 AND u.type=1 AND su.sessionId = ?', [sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== ************ results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}
	
}

module.exports = new Newsletter();

