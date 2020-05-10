const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class SessionEquipmentMapping{

	constructor(){
		this.table = 'session-equipment_mapping';
	}
	
	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addSessionEquipment(data){

        let table = this.table;
        console.log('------lalitactivityType---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (sessionId, equipment_id,quantity,link) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

                console.log('----------sessionequipment11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

	async updateSessionEquipment(data){

        let table = this.table;
        console.log('------lalitactivityType---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE ??  SET status = 0 WHERE sessionId = ? AND status = 1', [table, data], function (error, results, fields) {
                if (error) reject(error);

                console.log('----------sessionequipment11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

		/**
	 * Get Lists of all equipments
	 * @param  {int} sessionId
	 * @return {obj} 
	 */


    async getSessionEquipmentDTA(sessionId){

        let table = this.table;
        console.log('------lalitequipmentdta---------',sessionId)

		return await new Promise((resolve, reject) => {
			db.query('SELECT ie.id, ie.name,sem.quantity,sem.link FROM sessions s LEFT JOIN ?? sem ON sem.sessionId = s.id  LEFT JOIN Interest_equipment ie ON ie.id=sem.equipment_id  WHERE s.status = 1 AND s.id= ? AND sem.status = 1', [table,sessionId], function (error, results, fields) {
			if (error) reject(error);
			console.log('=======lalittiwari=========== ************ getSessionEquipmentDTA ', error);
			// db.end();
			return resolve(results);

			});
		});
	}

}

module.exports = new SessionEquipmentMapping();
