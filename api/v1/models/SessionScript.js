const isEmpty = require("is-empty");
const underscore = require("underscore");
const db = require(process.cwd() + '/library/Mysql');
const scriptAttr = require('./ScriptAttributes');
const SessionEmojies = require('./SessionEmojies');
class SessionScript{

	constructor(){
		this.table = 'session_script';
	}

			/**
	 * Get upcomming session
	 * @param  {int} userId 
	 * @return {obj} 
	 */
	async getProductList(sessionId, userId) {
        return await new Promise((resolve, reject) => {
        	db.query('SELECT ss.id, ss.name, ss.description, ss.image, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ? AND ss.userId = ? AND status = 1', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			  // console.log('================== results ', results)
			  // db.end();
			  return resolve(results);
			});
        });
	}


	async getProductDetail(sessionId, userId, interest) {

		//console.log('=======lalitproductdetail111=========== error ', sessionId, userId)
		
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT ss.id, ss.name, ss.description, ss.image, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ? AND ss.userId = ? AND ssm.status = 1 AND ss.status = 1', [sessionId, userId], function (error, results, fields) {
			 	
				 if (error) reject(error);
				 
				 //console.log('=======lalitproductdetail=========== results ', results)

				 if(results == '')
			  	{
					return resolve(results);  
				  }
		  		scriptAttr.getAttributesByIds(underscore.pluck(results, 'sessionScriptId'))
			  		.then(function(attributes){

	  					let nestedData = [];
			  			if(!isEmpty(attributes)){

		  					for(let j in attributes){
			  					let attrData = attributes[j];
			  					
		  						if(interest == 101){
		  							let position = '';
		  							if(attrData.attrLabel.toLowerCase() == 'target zone')
		  								position = 1;
		  							else if(attrData.attrLabel.toLowerCase() == 'target bpm')
		  								position = 2;
		  							else if(attrData.attrLabel.toLowerCase() == 'counter')
		  								position = 0;
		  							else if(attrData.attrLabel.toLowerCase() == 'activity type')
		  								position = 3;
		  							else if(attrData.attrLabel.toLowerCase() == 'duration')
		  								position = 4;
		  							else if(attrData.attrLabel.toLowerCase() == 'video')
		  								position = 5;
		  							underscore.extend(attrData, {position : position});
			  						
			  						if(!nestedData[attrData.orderBy]){
					  					for(let i in results){
						  					let sessData = results[i];
						  					if(sessData.id == attrData.sessionScriptId){
						  						sessData.attribute = [];
				  								nestedData[attrData.orderBy] = sessData;
				  							}
						  				}
			  						}
		  							nestedData[attrData.orderBy]['attribute'].push(attrData);
		  						} else if(interest == 100) {
		  							if(!nestedData[attrData.sessionScriptId]){
					  					for(let i in results){
											  let sessData = results[i];
											  console.log('*********sessData********',sessData);
						  					if(sessData.id == attrData.sessionScriptId){
						  						sessData.attribute = [];
												  nestedData[attrData.sessionScriptId] = sessData;
												  
										 console.log('*********nestedData********',nestedData);
				  							}
						  				}
									  }
									  
									  //console.log('*********nestedData4444********',nestedData);
									  nestedData[attrData.sessionScriptId]['attribute'].push(attrData);
									  
									  //	 console.log('*******nestedData111111**********',nestedData);
		  						}
			  					// console.log('*****************',nestedData);
			  				}	
						  }
						 // console.log('*******nestedData22222**********',nestedData);
			  			nestedData = underscore.filter(nestedData , function(data){
			  				return data != null;
						  });
						  // console.log('******nestedData3333***********',nestedData);
			  			return resolve(nestedData);
			  		});

					//   SessionEmojies.getEmojiesByIds(underscore.pluck(results, 'sessionScriptId'))
			  		// .then(function(emojies){						  
					// 	let nextData = [];
			  		// 	if(!isEmpty(emojies)){

					// 	  }
						  
					// });
			  // db.end();
			});
        });
	}
	
	
	async getProducts(sessionId) {

		console.log('=======lalitproductdetail111=========== error ', sessionId)
		
        return await new Promise((resolve, reject) => {

       	
			db.query('SELECT ss.id, ss.name, ss.description, ss.image, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ?  AND ssm.status = 1 AND ss.status = 1', [sessionId], function (error, results, fields) {
			 	
				 if (error) reject(error);
				 
				 console.log('=======lalitproductdetail=========== error ', error)

				 console.log('=======lalitproductdetail=========== results ', results)

				//  if(results == '')
			  	// {
				// 	return resolve(results);  
				//   }
				  return resolve(results);  
		  		// scriptAttr.getAttributesByIds(underscore.pluck(results, 'sessionScriptId'))
			  	// 	.then(function(attributes){

	  			// 		let nestedData = [];
			  	// 		if(!isEmpty(attributes)){

		  		// 			for(let j in attributes){
			  	// 				let attrData = attributes[j];
			  					
		  		// 				if(interest == 101){
		  		// 					let position = '';
		  		// 					if(attrData.attrLabel.toLowerCase() == 'target zone')
		  		// 						position = 1;
		  		// 					else if(attrData.attrLabel.toLowerCase() == 'target bpm')
		  		// 						position = 2;
		  		// 					else if(attrData.attrLabel.toLowerCase() == 'counter')
		  		// 						position = 0;
		  		// 					else if(attrData.attrLabel.toLowerCase() == 'activity type')
		  		// 						position = 3;
		  		// 					else if(attrData.attrLabel.toLowerCase() == 'duration')
		  		// 						position = 4;
		  		// 					else if(attrData.attrLabel.toLowerCase() == 'video')
		  		// 						position = 5;
		  		// 					underscore.extend(attrData, {position : position});
			  						
			  	// 					if(!nestedData[attrData.orderBy]){
				// 	  					for(let i in results){
				// 		  					let sessData = results[i];
				// 		  					if(sessData.id == attrData.sessionScriptId){
				// 		  						sessData.attribute = [];
				//   								nestedData[attrData.orderBy] = sessData;
				//   							}
				// 		  				}
			  	// 					}
		  		// 					nestedData[attrData.orderBy]['attribute'].push(attrData);
		  		// 				} else if(interest == 100) {
		  		// 					if(!nestedData[attrData.sessionScriptId]){
				// 	  					for(let i in results){
				// 							  let sessData = results[i];
				// 							  console.log('*********sessData********',sessData);
				// 		  					if(sessData.id == attrData.sessionScriptId){
				// 		  						sessData.attribute = [];
				// 								  nestedData[attrData.sessionScriptId] = sessData;
												  
				// 						 console.log('*********nestedData********',nestedData);
				//   							}
				// 		  				}
				// 					  }
									  
				// 					  //console.log('*********nestedData4444********',nestedData);
				// 					  nestedData[attrData.sessionScriptId]['attribute'].push(attrData);
									  
				// 					  //	 console.log('*******nestedData111111**********',nestedData);
		  		// 				}
			  	// 				// console.log('*****************',nestedData);
			  	// 			}	
				// 		  }
				// 		 // console.log('*******nestedData22222**********',nestedData);
			  	// 		nestedData = underscore.filter(nestedData , function(data){
			  	// 			return data != null;
				// 		  });
				// 		  // console.log('******nestedData3333***********',nestedData);
			  	// 		return resolve(nestedData);
			  	// 	});

					//   SessionEmojies.getEmojiesByIds(underscore.pluck(results, 'sessionScriptId'))
			  		// .then(function(emojies){						  
					// 	let nextData = [];
			  		// 	if(!isEmpty(emojies)){

					// 	  }
						  
					// });
			  // db.end();
			});
        });
	}


	async getProductDetail_Bakup(sessionId, userId, interest) {
		
        return await new Promise((resolve, reject) => {
        	
        	db.query('SELECT ss.*, ssm.sessionScriptId FROM session_script ss LEFT JOIN session_script_mapping ssm ON ssm.sessionScriptId = ss.id WHERE ssm.sessionId = ? AND ss.userId = ? AND status = 1', [sessionId, userId], function (error, results, fields) {
			  if (error) reject(error);
			   console.log('=====lalitproduct2222============= results ', results)
			  	
		  		scriptAttr.getAttributesByIds(underscore.pluck(results, 'sessionScriptId'))
			  		.then(function(attributes){

			  			let productData = {};
			  			if(!isEmpty(attributes)){

			  			// console.log('================== attributes ', attributes)
			  				for(let i in results){
			  					let sessData = results[i];
			  					let nestedData = [];
			  					for(let j in attributes){
				  					let attrData = attributes[j];
				  					if(sessData.id == attrData.sessionScriptId){
				  						if(interest == 101){
				  							let position = '';
				  							if(attrData.attrLabel == 'TARGET ZONE')
				  								position = 1;
				  							else if(attrData.attrLabel == 'TARGET BPM')
				  								position = 2;
				  							else if(attrData.attrLabel == 'counter')
				  								position = 0;
				  							underscore.extend(attrData, {position : position});
				  						}
				  						nestedData.push(attrData);
				  					}
				  				}
				  				underscore.extend(results[i], { attribute : nestedData});
			  				}		
			  			}
			  			return resolve(results);
			  		});

			  // db.end();
			});
        });
	}
	
	
	async add(data) {
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('INSERT INTO ?? SET name=?, description=?, userId=?, interestId=?, status=1', 
					[
						table,
						data.name, 
						data.description,
						data.userId,
						data.interestId
					], function (error, results, fields) {
			  if (error) reject(error);

			  return resolve(isEmpty(results) ? 0 : results.insertId);
			});
		});
	}

	async updateSessionScript(data) {
		console.log('mapping data-------', data);
		let table = this.table;
		return await new Promise((resolve, reject) => {
			db.query('UPDATE ?? set status = 0 WHERE id = ? AND status = 1', [table,data],function (error, results, fields) {
			  if (error) reject(error);

			  return resolve(isEmpty(results) ? 0 : results);
			});
		});
	}
}

module.exports = new SessionScript();
