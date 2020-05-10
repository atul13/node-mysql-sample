const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class User{

	constructor(){
		this.table = 'users';
	}

	/**
	 * Get all active users
	 * @return {obj}
	 */
	async getUsers(){

		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT * FROM ?? WHERE status = 1', [table], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}


	async getOnBoarding(email){

		let table = this.table;
		console.log('---email------',email)
        return await new Promise((resolve, reject) => {
        	db.query('select if((SELECT count(username) FROM `tbl_onboarding` WHERE username like "%'+email+'%" AND audioQ = 1 AND videoQ = 1)>=1, 0, 1) as ifExist', function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
        })
	}


	/**
	 * Get all active users
	 * @return {obj}
	 */
	async getExistsUser(){

		let table = this.table;
		
        return await new Promise((resolve, reject) => {
        	db.query('SELECT id,firstName,lastName,email FROM ?? WHERE status = 1 AND  isBanned = 0 AND type = 1', [table], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        })
	}

	/**
	 * Get single user Detail
	 * @param  {int} id
	 * @return {obj} 
	 */
	async getUserById(id){

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('SELECT * FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
			  if (error) reject(error);	   
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
		
	}

	async getUserdetailById(id){

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('SELECT id, firstName, lastName, email, password, image, status,type, isBanned FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
			  if (error) reject(error);
			   
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
		
	}


	async getUserdetailnewById(id){

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('SELECT id, firstName, lastName, email, password, image, status,type, isBanned FROM ?? WHERE id = ? ', [table, id], function (error, results, fields) {
			  if (error) reject(error);
			   
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
		
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getUserByEmail(email){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query('SELECT id, firstName, lastName, email, password, image, status,isOtpVerified,type, isBanned FROM ?? WHERE email = ?  AND  status = 1  AND  isOtpVerified = 1 limit 1', [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}


		/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getUserListByEmail(email){

		let table = this.table;	
		return await new Promise((resolve, reject) => {
			db.query('SELECT id, firstName, lastName, email, password, image, status,isOtpVerified,type, isBanned FROM ?? WHERE email = ?  AND  status = 1 limit 1', [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getExistsUserByEmail(email){

		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query("SELECT id, firstName, lastName, email, password, status, image, type FROM ?? WHERE email = ?  AND status = 1  AND  isOtpVerified = 1  AND isBanned = 0  LIMIT 1", [table, email], function (error, results, fields) {
			  if (error) reject(error);
			//   console.log('================== results12345 ', error, results[0], results);
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}


		/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getExistsUserByEmail1(email){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query("SELECT id, firstName, lastName, email, password, status, image, type FROM ?? WHERE email = ?  AND status = 1  AND isBanned = 0  LIMIT 1", [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  //console.log('================== results12345 ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

		/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getExistsNewUserByEmail(email){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query("SELECT id, firstName, lastName, email, password, status, image, type FROM ?? WHERE email = ?   AND isBanned = 0  LIMIT 1", [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  //console.log('================== results12345 ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getExistsUserByEmailOrMobile(email, phone){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query("SELECT id, firstName, lastName, email, password, status,type FROM ?? WHERE (email = ? OR (phone = ? AND phone != '' )) LIMIT 1", [table, email, phone], function (error, results, fields) {
			  if (error) reject(error);
			 // console.log('================== results1111 ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	/**
	 * add new record
	 * @param {obj} userData
	 */
	async add(userData) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET name=?, firstName=?, lastName=?, email=?, password=?,address1=?,address2=?,city=?,state=?,zip=?,image=?,type=?,  status=1', [table,userData.name, userData.firstName, userData.lastName, userData.email, userData.password, userData.address1, userData.address2, userData.city, userData.state, userData.zip, userData.image, userData.type], function (error, results, fields) {
			  if (error) //reject(error);
			   console.log('================== results ', error)
			  // db.end();
			 // return resolve(isEmpty(results) ? 0 : results.insertId);

			  if(error != null)
			  {
				  console.log('==========lalitErr11111======== ************ results ', error)
				  return resolve(error.sqlMessage);
			  }
			   else{
				return resolve(isEmpty(results) ? 0 : results.insertId);
			   }

			});
		});
	}

	
	async updatePassword(email,password) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET password = ? WHERE email = ? AND status = 1', [table,password, email], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();

			 // console.log('-----updatepassword--------',results)
			  return resolve(isEmpty(results) ? 0 : results);
			});
		});
	}

		
	async updateUserRole(email,type) {
		let table = this.table;
		console.log('-------email,type-----------',email,type)
		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET type = ? WHERE email = "'+email+'" AND status = 1', [table,type], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('================== results ', error)
			  // db.end();

			//  console.log('-----updateType--------',results)
			  return resolve(isEmpty(results) ? 0 : results.affectedRows);
			});
		});
	}

		/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async getFirstSignup(email){

		let table = this.table;
	
		return await new Promise((resolve, reject) => {
			db.query('SELECT id, firstName, lastName, email, password, image,isFirstSignup, status,type, isBanned FROM ?? WHERE email = ?  limit 1', [table, email], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(isEmpty(results) ? '' : results[0]);
			});
		});
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async UpdateFirstSignup(email){

		let table = this.table;
		
			return await new Promise((resolve, reject) => {
				db.query('UPDATE ?? SET isFirstSignup = 1  WHERE email = "'+email+'" ', [table], function (error, results, fields) {
				  if (error) reject(error);
				   console.log('================== results ', error)
				  // db.end();
	
				//  console.log('-----updateType--------',results)
				  return resolve(isEmpty(results) ? 0 : results.affectedRows);
				});
			});
	
	}

	/**
	 * Get User by email address
	 * @param  {string} email
	 * @return {obj} 
	 */
	async UpdateUserStatus(email){

		let table = this.table;
		
			return await new Promise((resolve, reject) => {
				db.query('UPDATE ?? SET  isOtpVerified = 1 WHERE email = "'+email+'" ', [table], function (error, results, fields) {
				  if (error) reject(error);
				   console.log('================== results ', error)
				  // db.end();
	
				//  console.log('-----updateType--------',results)
				  return resolve(isEmpty(results) ? 0 : results.affectedRows);
				});
			});
	
	}
}

module.exports = new User();

