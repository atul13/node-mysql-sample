const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class Records{

	constructor(){
		this.table = 'recorded';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addrecord(data){
        let table = this.table;
        console.log('------addrerded---------',data)
        return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? (recordFile, userId, sessionId, status) VALUES ?', [this.table, data], function (error, results, fields) {
      if (error) console.log(error);
     // console.log('==========mmErr======== ************ results ', error)
      return resolve(isEmpty(results) ? 0 : results.insertId);
    });;
        });
	}
}
module.exports = new Records();
