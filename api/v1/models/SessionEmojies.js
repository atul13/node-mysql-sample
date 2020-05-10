const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class SessionEmojies{

	constructor(){
		this.table = 'session_emojies';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addSessionEmojies(data){

        let table = this.table;
        console.log('------lalitEmojies---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (session_id, sessionScriptId,emojies_id,emojies_type,status) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

               // console.log('----------lalitEmojies11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

	async getEmojiesTopLevelList(sessionId,sessionScriptIds) {
		console.log('!!!sessionId,sessionScriptIds!!!!!!!!!',sessionId, sessionScriptIds);
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT emojies_type as emojiesGroup ,type FROM session_emojies  WHERE sessionScriptId = ? AND session_id = ? AND status = 1 GROUP BY emojies_type,type', [sessionScriptIds,sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('=========lalirscriptattributes========= results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}

	async getEmojiesGroup(sessionId,sessionScriptIds,interestId) {
		console.log('!!!sessionId,sessionScriptIds!!!!!!!!!',sessionId, sessionScriptIds);
		let table = this.table;
		if(interestId == 1){
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT em.emojies_type as emojiesGroup,em.type FROM session_emojies se INNER JOIN emojies em ON em.id = se.emojies_id  WHERE se.sessionScriptId = ? AND se.session_id = ? AND se.status = 1 GROUP BY em.emojies_type,em.type', [sessionScriptIds,sessionId], function (error, results, fields) {
			  if (error) reject(error);
			 //  console.log('=========lalirscriptattributes========= results ', results)
			  // db.end();
			  return resolve(results);
			});
		})
	}else{

		return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT em.id,em.name,em.emojies_type as emojiesGroup,em.path,em.type FROM session_emojies se INNER JOIN emojies em ON em.id = se.emojies_id  WHERE se.sessionScriptId = ? AND se.session_id = ? AND se.status = 1 ', [sessionScriptIds,sessionId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('=========lalirscriptattributes========= results ', results)
			  // db.end();
			  return resolve(results);
			});
		})

		}
	}

	async getEmojiesBySessionScriptIds(sessionId,sessionScriptIds,emojies_type) {
		console.log('!!!!!!!!!!!!', sessionScriptIds);
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT em.id,se.sessionScriptId, em.name,em.path FROM session_emojies se LEFT JOIN emojies em on em.id=se.emojies_id WHERE se.sessionScriptId = ? AND se.session_id = ? AND em.emojies_type = ? AND se.status = 1 AND em.status = 1', [sessionScriptIds,sessionId,emojies_type], function (error, results, fields) {
			  if (error) reject(error);
			   //console.log('=========lalisesionEmmojies========= results ', error)
			  // db.end();
			  return resolve(results);
			});
        })
	}

	async updateSessionEmojies(data){

        let table = this.table;
        console.log('------lalitshopping---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE ?? SET status = 0 WHERE sessionId = ? AND status = 1', [table, data], function (error, results, fields) {
                if (error) reject(error);

               // console.log('----------sessionEmojies------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

}

module.exports = new SessionEmojies();
