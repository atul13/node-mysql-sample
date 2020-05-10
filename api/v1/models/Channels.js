const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const channelHost = require('./ChannelHost');

class Channels{

	constructor(){
		this.table = 'channels';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


    async addchannel(data){

        let table = this.table;
        //console.log('------addchannel1111111111111---------',data)

        return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET name=?, description=?, individualOrBusiness=?,groupId=?, ss=?, ein=?, chargeForSessiones=?, image=?, userId=?, phone=?, street_address1=?, street_address2=?,city=?, country_code=?, state_code=?, zip_code=?, account_name=?, account_number=?, account_type=?, routing_number=?, charge_amount=?, has_shopping_list=?, has_equipment_list=?, has_product_list=?, status=1', [
                this.table,
                data.name, 
                data.description, 
                data.individualOrBusiness,
                data.groupId, 
                data.ss,
                data.ein,
                data.chargeForSession,
                data.image,
                data.userId,
                data.phone,
                data.street_address1,
                data.street_address2,
                data.city,                            
                data.country_code,
                data.state_code,
                data.zip_code,
                data.account_name,
                data.account_number,
                data.account_type,
                data.routing_number,
                data.charge_amount,
                data.has_shopping_list,
                data.has_equipment_list,
                data.has_product_list
                ], function (error, results, fields) {
      if (error) //reject(error);
     console.log('==========lalitErr======== ************ results ', error)
      //return resolve(isEmpty(results) ? 0 : results.insertId);

      if(error != null)
			{
				console.log('==========lalitErr11111======== ************ results ', error.sqlMessage)
				return resolve(error.sqlMessage);
			}
			 else{
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			 }

         });
        });
  }




  	/**
	 * Get Lists of all equipments
	 * @param  {int} interestId
	 * @return {obj} 
	 */


  async updatechannel(data,channelId){

    let table = this.table;
    console.log('------addchannel1111111111111---------',data,channelId)

    return await new Promise((resolve, reject) => {
  db.query('UPDATE ?? SET name=?, description=?, individualOrBusiness=?,groupId=?, ss=?, ein=?, chargeForSessiones=?, image=?, userId=?, phone=?, street_address1=?, street_address2=?,city=?, country_code=?, state_code=?, zip_code=?, account_name=?, account_number=?, account_type=?, routing_number=?, charge_amount=?, has_shopping_list=?, has_equipment_list=?, has_product_list=?, status=1  WHERE id = ?', [
            this.table,
            data.name, 
            data.description, 
            data.individualOrBusiness,
            data.groupId, 
            data.ss,
            data.ein,
            data.chargeForSession,
            data.image,
            data.userId,
            data.phone,
            data.street_address1,
            data.street_address2,
            data.city,
            data.country_code,                            
            data.state_code,
            data.zip_code,
            data.account_name,
            data.account_number,
            data.account_type,
            data.routing_number,
            data.charge_amount,
            data.has_shopping_list,
            data.has_equipment_list,
            data.has_product_list,
            channelId
            ], function (error, results, fields) {
  if (error) //reject(error);
  console.log('==========lalitErr======== ************ results ', error)
 // return resolve(isEmpty(results) ? 0 : results.affectedRows);

        if(error != null)
        {
          return resolve(error.sqlMessage);
        }
          else{
        return resolve(isEmpty(results) ? 0 : results.affectedRows);
          }

      });
    });
}
  
  	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelList(userId) {

		//console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT c.*,ch.hostId,ch.channelAdmin FROM channels c INNER JOIN channel_host ch  ON ch.channelId = c.id  WHERE c.status = 1 AND ch.hostId =?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelList---------',error)
          
			  	return resolve(results);
			});
      });
  }

    	/**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async checkChannelList(userId) {

		//console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT c.* FROM channels c WHERE c.status = 1 AND c.userId =?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelList---------',error)
          
			  	return resolve(results);
			});
      });
  }

  /**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelId(userId) {

		//console.log('------lalitgetchannel---------',userId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT c.id FROM channels c WHERE c.status = 1 AND c.userId =?', [userId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelList---------',error)          
			  	return resolve(isEmpty(results) ? 0 : results[0]);
			});
      });
  }
  
  /**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelDetails(channelId,userId) {

		//console.log('------lalitgetchannel---------',channelId)
		
        return await new Promise((resolve, reject) => {
        
        	db.query('SELECT c.*, u.firstName as ChannelAdmin FROM channels c  INNER JOIN users u  ON u.id= c.userId  WHERE c.status = 1 AND c.id =?  AND c.userId = ?', [channelId,userId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelList---------',error)          
			  	return resolve(results[0]);
		  	});

      });
  }
  
  async getChannelName(channelId) {

		//console.log('------lalitgetchannel---------',channelId)
		
        return await new Promise((resolve, reject) => {
         
        	db.query('SELECT c.*  FROM channels c  WHERE c.status = 1 AND c.id =? ', [channelId], function (error, results, fields) {
				  if (error) reject(error);				  
          //console.log('------getchannelList---------',error)          
			  	return resolve(results[0]);
		  	});

      });
  }
  
  async getChannelImage(user_id,channelId) {

		//console.log('------lalitgetchannel---------',channelId)
		
        return await new Promise((resolve, reject) => {
         
        	db.query('SELECT image  FROM channels c  WHERE c.status = 1  AND c.userId =?  AND c.id =? ', [user_id,channelId], function (error, results, fields) {
				  if (error) reject(error);				  
          console.log('------getchannelList---------',error)          
			  	return resolve(results[0]);
		  	});

      });
	}

}

module.exports = new Channels();
