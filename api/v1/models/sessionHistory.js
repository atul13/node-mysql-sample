const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');

class sessionHistory{

	constructor(){
		this.table = 'sessionHistory';
	}

	/**
	 * Get Lists of all equipments
	 * @param  {int} sessionId
	 * @return {obj} 
	 */


    async addsessionHistory(data){

        let table = this.table;
        console.log('------lalitEmojies---------',data)

		return await new Promise((resolve, reject) => {
            
        	db.query('INSERT INTO ??  SET sessionId=?,userId=?,activityType=?,timeStamp=?,rtm=?,deviceInformation=?, emojiesId=?,systemIp=?,status=1',[
                this.table,
                data.sessionId, 
                data.userId, 
                data.activityType, 
                data.timeStamp,
                data.rtm,
                data.deviceInformation,
                data.emojiesId,
                data.systemIp,
                data.status
                ], function (error, results, fields) {
                if (error) reject(error);

                //console.log('----------lalitEmojies11------------------',error)

                return resolve(isEmpty(results) ? 0 : results.insertId);
              });
		});
	}

	

}

module.exports = new sessionHistory();
