const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");
// const ip = require("ip");

class Onboarding{

	constructor(){
		this.table = 'tbl_onboarding';
	}

	/**
	 * add record from onboarding form
	 * @param {obj} onboardingData
	 */
	async add(onboardingData) {
		let ipAdd = "122.103.34.100"
		// console.log('manmohan-----',ip.address() );
		// let table = 'tbl_newsletter';
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET username=?,deviceInfo=?,islogin=?,videoQ=?,audioQ=?,ip=?,remote=?,status=1', [this.table,onboardingData.username, onboardingData.deviceInfo,onboardingData.islogin, onboardingData.videoq,onboardingData.audioq,ipAdd,onboardingData.remote], function (error, results, fields) {
			  if (error) reject(error);
			//   console.log(results);
			//    console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}
}

module.exports = new Onboarding();

