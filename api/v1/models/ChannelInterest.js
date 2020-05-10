const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class ChannelInterest{

	constructor(){
		this.table = 'channel_interest';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} channelId
	 * @return {obj} 
	 */


    async getInterestforaChannel(channelId){

        let table = this.table;
       // console.log('------getInterestBychannel---------',channelId)

        // return await new Promise((resolve, reject) => {
        //     db.query('SELECT  inte.id,inte.title FROM channel_interest ca INNER JOIN interest inte on inte.id = ca.interestId WHERE ca.channelId = ? AND inte.status = 1   GROUP BY inte.id', [channelId], function (error, results, fields) {
        //         if (error) reject(error);
        //      console.log('=======InterestBychanne=========== ', error)
        //         // db.end();
        //         return resolve(results);
        //       });
        // });

        return await new Promise((resolve, reject) => {
            db.query('SELECT  inte.id,inte.title FROM  interest inte WHERE  inte.status = 1 ', [channelId], function (error, results, fields) {
                if (error) reject(error);
            // console.log('=======InterestBychanne=========== ', error)
                // db.end();
                return resolve(results);
              });
        });

    }


    /**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChanneInterestlList(channelId) {

		console.log('------getchannelInterest---------',channelId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT inte.*  FROM channel_interest chi INNER JOIN interest inte  ON inte.id = chi.interestId  WHERE  inte.status = 1  AND chi.channelId = ? AND chi.status = 1', [channelId], function (error, results, fields) {
				  if (error) reject(error);
				  
         // console.log('------getchannelInterest---------',error)
          
			  	return resolve(results);
			});
      });
	}


	   /**
	 * Get Lists of all hosts
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getChannelInterest(channelId,interestId) {

		console.log('------getchannelInterest---------',channelId,interestId)
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT interestId FROM channel_interest  WHERE channelId = ? AND interestId = ? AND status = 1', [channelId,interestId], function (error, results, fields) {
				  if (error) reject(error);
				  
       //   console.log('------getchannelInterest---------',error)
          
			  	return resolve(results);
			});
      });
	}



    

    async addChannelInterest(data) {

		console.log('------interestListData111---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ?? (channelId, interestId) VALUES ?', [this.table, data], function (error, results, fields) {
                if (error) reject(error);

			//	console.log('----------sessionuser------------------',error)
				
				//console.log('----------interestListData222------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}

	async updateChannelInterest(data) {

		console.log('------interestListData111---------',data)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('UPDATE  ?? SET status = 0 WHERE  channelId = ?', [this.table, data], function (error, results, fields) {
                if (error) reject(error);

				//console.log('----------sessionuser------------------',error)
				
				//console.log('----------interestListData222------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}


	async deleteChannelInterest(channelId,interestId) {

		console.log('------interestListData111---------',channelId,interestId)
		
		return await new Promise((resolve, reject) => {
            
        	db.query('DELETE  FROM  ??  WHERE  channelId = ? AND interestId = ?', [this.table,channelId,interestId], function (error, results, fields) {
                if (error) reject(error);

				//console.log('----------sessionuser------------------',error)
				
				//console.log('----------interestListData222------------------',results)

				//return resolve(isEmpty(results) ? 0 : results);
				return resolve(results);
              });
		});
	}

}

module.exports = new ChannelInterest();
