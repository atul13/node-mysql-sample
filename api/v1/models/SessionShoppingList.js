const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class SessionShoppingList{

	constructor(){
		this.table = 'session_shopping_list';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addSessionshoppingList(data){

        let table = this.table;
        console.log('------lalitshopping---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (sessionId, shopping_list_id,quantity,item_note,link) VALUES ?', [table, data], function (error, results, fields) {
                if (error) reject(error);

               // console.log('----------sessionshoppinht11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

	async updateSessionshoppingList(data){

        let table = this.table;
        console.log('------lalitshopping---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE ?? SET status = 0 WHERE sessionId = ? AND status = 1', [table, data], function (error, results, fields) {
                if (error) reject(error);

               // console.log('----------sessionshoppinht11------------------',error)

                return resolve(isEmpty(results) ? 0 : results);
              });
		});
	}

		/**
	 * Get Lists of all equipments
	 * @param  {int} sessionId
	 * @return {obj} 
	 */


    async getSessionshoppingDTA(sessionId){

        let table = this.table;
        console.log('------lalitshoppingdta---------',sessionId)

		return await new Promise((resolve, reject) => {
			db.query('SELECT isl.id,isl.name,ssla.quantity,ssla.item_note,ssla.link FROM sessions s LEFT JOIN session_shopping_list ssla ON ssla.sessionId = s.id  LEFT JOIN Interest_shopping_list_items isl ON isl.id=ssla.shopping_list_id  WHERE s.status = 1 AND s.id= ? AND ssla.status = 1', [sessionId], function (error, results, fields) {
			if (error) reject(error);
			//console.log('=======lalittiwari=========== ************ results ', error)
			// db.end();
			return resolve(results);

			});
		});
	}

}

module.exports = new SessionShoppingList();
