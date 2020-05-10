const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class country{

	constructor(){
		this.table = 'country';
	}

	/**
	 * Get all active country
	 * @return {obj}
	 */
	async getCountry(){

		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,countryName,code as countryCode FROM ?? WHERE status = 1', [table], function (error, results, fields) {
			  if (error) reject(error);
			 //  console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
        })  
    }
    

    	/**
	 * Get all active state according to country
	 * @return {obj}
	 */
	async getState(countryId){

		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,stateName,postalCode as stateCode FROM state WHERE status = 1 AND countryId = ?', [countryId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', error)
			  // db.end();
			  return resolve(results);
			});
        })
	}


	
}

module.exports = new country();

