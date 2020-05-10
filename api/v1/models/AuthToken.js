const db = require(process.cwd() + '/library/Mysql')

class AuthToken{

	constructor(){
		this.table = 'token';
	}

	/**
	 * Create user auth token 
	 * @param  {int} userId
	 * @param  {string} token 
	 * @return {obj}
	 */
	async updateToken(userId, token){

	    let table = this.table;
		return await new Promise( (resolve, reject) => {
			 db.query('INSERT IGNORE INTO ?? (token, userId) VALUES (?, ?)', [table, token, userId], function (error, results, fields) {
				if (error) reject(error);

				// console.log('*******************', results)
				if(results.insertId == 0){

					 db.query('UPDATE ?? SET token = ? WHERE userId = ?', [table, token, userId], function (error, results, fields) {
					  if (error) reject(error);
					  // console.log('================== 123 results ', results)
					  // db.end();
					  return resolve(results);
					});
				}

			});

		});
	}

		/**
	 * Create user auth token 
	 * @param  {int} userId
	 * @param  {string} token 
	 * @return {obj}
	 */
	async updateNewToken(userId, token){

	    let table = this.table;
		return await new Promise( (resolve, reject) => {
			 db.query('INSERT IGNORE INTO ?? (token, userId) VALUES (?, ?)', [table, token, userId], function (error, results, fields) {
				if (error) reject(error);

				// console.log('*******************', results)
				if(results.insertId == 0){

					 db.query('UPDATE ?? SET token = ? WHERE userId = ?', [table, token, userId], function (error, results, fields) {
					  if (error) reject(error);
					  // console.log('================== 123 results ', results)
					  // db.end();
					  return resolve(results);
					});
				}

			});

		});
	}

	async getId(userId){
console.log('-------userId-------',userId)
	    let table = this.table;
		return await new Promise( (resolve, reject) => {
			 db.query('SELECT userId FROM ?? WHERE userId = ?  LIMIT 1', [table,userId], function (error, results, fields) {
				if (error) reject(error);
//console.log('-----------results--------',error)
				return resolve(results);

			});

		});
	}

	async updateTokenId(userId, token){
		console.log('-------userId-------',userId)
				let table = this.table;
				return await new Promise( (resolve, reject) => {
					db.query('UPDATE ?? SET token = ? WHERE userId = ?', [table, token, userId], function (error, results, fields) {
						if (error) reject(error);
						// console.log('================== 123 results ', error)
						// db.end();
						return resolve(results.affectedRows);
		
					});
		
				});
			}

			async insertTokenId(userId, token){
				console.log('-------insertuserId-------',userId)
						let table = this.table;
						return await new Promise( (resolve, reject) => {
							db.query('INSERT  INTO ?? (token, userId) VALUES (?, ?)', [table, token, userId], function (error, results, fields) {
								if (error) reject(error);
							//console.log('-----------insertresults--------',results)
								return resolve(results.affectedRows);
				
							});
				
						});
					}
}

module.exports = new AuthToken();