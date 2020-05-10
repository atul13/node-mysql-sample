const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class Interest{

	constructor(){
		this.table = 'interest';
	}


		/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getInterest(groupId) {

		console.log('------lalitgetchannel---------',groupId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ??  WHERE groupId=?  AND status = 1', [this.table, groupId], function (error, results, fields) {
				  if (error) reject(error);				  
				 // console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}



			/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getInterestByGroupId(groupId) {

		console.log('------lalitgetchannel---------',groupId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,title as name,description,image FROM ??  WHERE groupId=?  AND status = 1', [this.table, groupId], function (error, results, fields) {
				  if (error) reject(error);				  
				 // console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}

	async getInterestByGroupName(groupName) {

		console.log('------lalitgetchannel---------',groupId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ??  WHERE groupId=?  AND status = 1', [this.table, groupId], function (error, results, fields) {
				  if (error) reject(error);				  
				  //console.log('------getchannel---------',error)

			  	return resolve(results);
			});
        });
	}

    /**
	 * Add Interest
	 * @param  {int} userId 
	 * @return {obj} 
	 */

	async addInterest(data) {

		console.log('------addInterest---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? SET code=?,title=?,groupId=?,description=?,image=?,video=?,haveShoppingList=?,haveEquipment=?,haveProductList=?,attendeesAreCalled=?,virtualRoomIsCalled=?,inProduction=?, status=1', [
                this.table,
                data.code, 
                data.title, 
                data.groupId, 
                data.description,
                data.image,
                data.video,
                data.haveShoppingList,
                data.haveEquipment,
                data.haveProductList,
                data.attendeesAreCalled,
                data.virtualRoomIsCalled,
                data.inProduction], function (error, results, fields) {
                if (error) reject(error);

				//console.log('----------sessionuser------------------',error)
				
				//console.log('----------addInterest22------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}

}

module.exports = new Interest();
