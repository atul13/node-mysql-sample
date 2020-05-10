const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class Member{

	constructor(){
		this.table = 'member';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} channelId
	 * @return {obj} 
	 */


    async addmembers(data){

        let table = this.table;

        return await new Promise((resolve, reject) => {
            db.query('INSERT INTO ?? SET channelId=?,firstName=?,lastName=?,email=?, status=1', [
                this.table,
                data.channelId,
                data.firstName,
                data.lastName,
                data.email              
                ], function (error, results, fields) {
              if (error) reject(error);
                  console.log('-----------results111------------',error)
                  //console.log('-----------results------------',results)
			  return resolve(results.insertId);
			});
        });
	}
	
	/**
	 * Get Lists of all equipments
	 * @param  {int} channelId
	 * @return {obj} 
	 */


    async updateMembers(data,memberId){

        let table = this.table;
		//console.log('---------data-------------',data)
        return await new Promise((resolve, reject) => {
            db.query('UPDATE ?? SET firstName=?,lastName=?,email=? WHERE id = ? AND (status =1 OR status=0)', [
                this.table,
                data.firstName,
                data.lastName,
				data.email,
				memberId              
                ], function (error, results, fields) {
              if (error) reject(error);
                  //console.log('-----------results111------------',error)
                  console.log('-----------results------------',results)
			  return resolve(results.affectedRows);
			});
        });
	}
	

		/**
	 * Get Lists of all equipments
	 * @param  {int} channelId
	 * @return {obj} 
	 */


    async updateMemberStatus(memberId,status){

        let table = this.table;
		console.log('---------memberId,status-------------',memberId,status)
		let data = status;
		// if(status == "active")
		// {
		// data = 1;
		// }else{
		// data = 0;
		// }
        return await new Promise((resolve, reject) => {
			
            db.query('UPDATE ?? SET status=?  WHERE id = ? ', [this.table,data,memberId], function (error, results, fields) {
              if (error) reject(error);
                  //console.log('-----------results111------------',error)
                 // console.log('-----------results------------',results)
			  return resolve(results.affectedRows);
			});
        });
    }
	
	
	/**
	 * Get Lists of all equipments
	 * @param  {int} memberId
	 * @return {obj} 
	 */


    async deleteMember(memberId){

        let table = this.table;
		console.log('---------memberId-------------',memberId)
        return await new Promise((resolve, reject) => {
            db.query('DELETE FROM  ??  WHERE id = ? ', [this.table,memberId], function (error, results, fields) {
              if (error) reject(error);
                  console.log('-----------results111------------',error)
                  console.log('-----------results------------',results)
			  return resolve(results.affectedRows);
			});
        });
    }
    
    /**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getmembers(channelId) {

		//console.log('------getmembers---------',channelId)
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,channelId,status,firstName,lastName,email FROM ??  WHERE channelId = ? AND (status=1 OR status=0) ORDER BY createAt DESC ', [table,channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
         console.log('------getmembers---------',results)
          
			  	return resolve(results);
			});
      });
    }
    
     /**
	 * Get Lists of all hosts
	 * @param  {int} emailId 
	 * @return {obj} 
	 */
	async getExistsMemByEmail(emailId,channelId) {

		//console.log('------getmembers---------',channelId)
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,channelId,firstName,lastName,email FROM ??  WHERE email = ? AND channelId = ? AND (status=1 OR status=0)', [table,emailId,channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getmembers---------',error)
          
			  	return resolve(results);
			});
      });
	}

	   /**
	 * Get Lists of all hosts
	 * @param  {int} memberId 
	 * @return {obj} 
	 */
	async getExistsMemById(memberId) {

		//console.log('------getmembers---------',channelId)
		let table = this.table;
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,channelId,firstName,lastName,email,status FROM ??  WHERE id = ?', [table,memberId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getmembers---------',error)
          
			  	return resolve(results);
			});
      });
	}

	/**call channel id from user id  */
	async getchannelByUserId(userId) {

		//console.log('------getmembers---------',channelId)
        return await new Promise((resolve, reject) => {
        	db.query('SELECT channelId,userid from channels where userId = ?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getmembers---------',error)
          
			  	return resolve(results);
			});
      });
	}

}

module.exports = new Member();
