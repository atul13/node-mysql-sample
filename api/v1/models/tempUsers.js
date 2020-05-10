const db = require(process.cwd() + '/library/Mysql');
const isEmpty = require("is-empty");

class tempUsers{

	constructor(){
		this.table = 'tempUsers';
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
			  return resolve(results[0]);
			});
		});
		
	}

	async getUserdetailById(id){

		let table = this.table;

		return await new Promise((resolve, reject) => {
			db.query('SELECT id, firstName, lastName, email, password, image, status,type, isBanned FROM ?? WHERE id = ? AND status = 1', [table, id], function (error, results, fields) {
			  if (error) reject(error);
			   
			  // db.end();
			  return resolve(results[0]);
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
			db.query('SELECT id, firstName, lastName, email, password, image, status,type, isBanned FROM ?? WHERE email = ? AND status = 1 limit 1', [table, email], function (error, results, fields) {
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
			db.query("SELECT * FROM ?? WHERE email = ? AND status = 0  LIMIT 1", [table, email], function (error, results, fields) {
			  if (error) reject(error);
			//  console.log('================== results12345 ', error)
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
	async addTempUser(userData) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET firstName=?, lastName=?, email=?, channelId=?, userType=?, status=0', [table, userData.firstName, userData.lastName, userData.email, userData.channelId, userData.userType], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', error)
			  // db.end();
			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	
	async updatePassword(email,password) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? SET password = ? WHERE email = ? AND status = 1', [table,password, email], function (error, results, fields) {
			  if (error) reject(error);
	
			  return resolve(isEmpty(results) ? 0 : results);
			});
		});
	}
}

module.exports = new tempUsers();

