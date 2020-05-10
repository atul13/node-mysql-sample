// const auth = require('../../auth/Auth');
const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const newsletterModel = require('../../models/Newsletter');
const response = require(process.cwd() + '/util/Response');
const expressValidator = require('express-validator');
//const requestIp = require('request-ip');
const defaultConfig = require(process.cwd() + '/config/default.config');

const saltRounds = 10;

class NewsletterCtrl {

	async check_invitecode(req, res) {
		//console.log('-----groupId------'+icode)
	    try {
			let icode = req.params.code;
		// let icode=req.query.code;
	//	console.log('-----groupId------'+icode)
			let inviteCode = await newsletterModel.getInvite(icode);

			//console.log('-----groupWithInterest------------',inviteCode)

			// res.status(200).send(user1);
		
			response.resp(res, 200, inviteCode)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

	/** this controller use for invite code */

	async invite(req, res) {
		let erroring={};
		if(isEmpty(req.body.email)){
			erroring.message = "Email is missing"; 
			console.log(erroring)
			res.setHeader("email", erroring.message)
			response.resp(res, 400,erroring)
		}	
	    try {			
			let insertData = req.body;			
			//console.log('----------insertData------------------',insertData)
			let group = await newsletterModel.addinvite(insertData);
			// res.status(200).send(user1);
			res.setHeader("success", "success")
				response.resp(res, 200, group)		
	    } catch(exception) {
			// res.status(500).send(exception)
			res.setHeader("error", "exception")
			response.resp(res, 500, exception)
	    }
	}


	async addnewsletter(req, res) {
	    try {
			let gettData = req.body;
            //console.log('--------req.body----------',insertData)

			// let intrestData = 'gettData.fitness, gettData.wine, gettData.cooking, gettData.beauty_makeup,gettData.homeimprovment';
			
			// let insertData = {		
			// 	name : gettData.name ? gettData.name :0,
			// 	email : gettData.email,
			// 	intrest:intrestData,
			// 	others : gettData.others ? gettData.others : 0
			// };

			
			//console.log('----------insertData------------------',gettData)

			let group = await newsletterModel.addnewsletter(gettData);
			// res.status(200).send(user1);
			response.resp(res, 200, group)
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}
}

module.exports = new NewsletterCtrl();