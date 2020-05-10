const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class InterestGroup{

	constructor(){
		this.table = 'interest_group';
	}



		/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getGroup() {

		//console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	//db.query('SELECT ig.id,ig.name FROM interest_group as ig  WHERE ig.status = 1', function (error, results, fields) {

				db.query('SELECT ig.id,ig.name FROM interest_group as ig  WHERE ig.status = 1 AND ig.id = 1', function (error, results, fields) {

				  if (error) reject(error);				  
				  //console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}


			/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getGroupForInterest() {

		//console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ig.id,ig.name FROM interest_group as ig  WHERE ig.status = 1', function (error, results, fields) {

				  if (error) reject(error);				  
				  //console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}



		/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getGroupInterest() {

		console.log('------lalitgetchannel---------')
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ig.name as groupName,ig.id as groupId,inter.id as interestId,inter.title as interestName FROM interest_group as ig Left JOIN interest as inter ON inter.groupId = ig.id WHERE  inter.status = 1  AND ig.status = 1', function (error, results, fields) {
				  if (error) reject(error);
				  
				 // console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}

	async addInterestGroup(data) {

		//console.log('------channelHostData11---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? SET name=?, status=1', [this.table, data], function (error, results, fields) {
                if (error) reject(error);

				//console.log('----------sessionuser------------------',error)
				
				//console.log('----------channelHostData22------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(isEmpty(results) ? 0 : results.insertId);
              });
		});
	}

}

module.exports = new InterestGroup();
