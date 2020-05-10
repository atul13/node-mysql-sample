const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');

class ChannelHost{

	constructor(){
		this.table = 'channel_host';
	}

	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelHostsList1(channelId) {

		console.log('------lalitgetchannel---------',channelId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.hostId as userId, CONCAT(u.firstName, " ", u.lastName) as username FROM channel_host as ch INNER JOIN users as u WHERE ch.hostId = u.id AND u.isBanned = 0  AND ch.channelId = ?', [channelId], function (error, results, fields) {
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
	async getChannel(userId) {

		console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.channelId  FROM channel_host as ch  WHERE  ch.hostId =?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
				 // console.log('------getchannel---------',error)
			  	return resolve(results['0']);
			});
        });
	}


		/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelList(userId) {

		console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.channelId  FROM channel_host as ch  WHERE  ch.hostId =?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
				 // console.log('------getchannel---------',error)
			  	return resolve(results);
			});
        });
	}

	
	async addChannelHost(data) {

		console.log('------channelHostData11---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (hostId, channelId,channelAdmin) VALUES ?', [this.table, data], function (error, results, fields) {
                if (error) reject(error);

				//console.log('----------sessionuser------------------',error)
				
				//console.log('----------channelHostData22------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}




	async updateChannelHost(data) {

		console.log('------channelHostData11---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE  ?? SET status = 0  WHERE channelId =  ?', [this.table, data], function (error, results, fields) {
                if (error) reject(error);

				//console.log('----------sessionuser------------------',error)
				
				//console.log('----------channelHostData22------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}

	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChanneHostList(channelId,userId) {

		console.log('------lalitgetchannelhost---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT u.*  FROM channel_host ch INNER JOIN users u  ON u.id = ch.hostId   WHERE  u.status = 1 AND ch.status = 1 AND ch.channelAdmin =?  AND ch.channelId = ?', [userId,channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelhost---------',error)
          
			  	return resolve(results);
			});
      });
	}

	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelHost(userId) {

		console.log('------lalitgetchannelhost---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id  FROM channel_host WHERE  hostId = ? AND status = 1', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelhost---------',error)
          
			  	return resolve(results);
			});
      });
	}


	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelHostForthisChannel(userId,channelAdmin) {

		console.log('------lalitgetchannelhost---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id  FROM channel_host WHERE  hostId = ? AND channelAdmin = ? AND status = 1', [userId,channelAdmin], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelhost---------',error)
          
			  	return resolve(results);
			});
      });
	}

	/**
	 * checkchannelExist
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelExist(channelId,userId) {

		console.log('------lalitgetchannelhost---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ch.channelId  FROM channel_host ch  WHERE ch.hostId = ?  AND ch.channelId = ?', [userId,channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelhost---------',error)
          
			  	return resolve(results);
			});
      });
	}

}

module.exports = new ChannelHost();
