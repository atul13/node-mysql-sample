const bcrypt = require('bcrypt');
const isEmpty = require("is-empty");
const underscore = require("underscore");
const onboardingModel = require('../../models/Onboarding');
const response = require(process.cwd() + '/util/Response');
const expressValidator = require('express-validator');
const defaultConfig = require(process.cwd() + '/config/default.config');

const saltRounds = 10;

class OnboardingCtrl {

	async addonboarding(req, res) {
	    try {
			let gettData = req.body;
			// console.log('manmohan-----',ip.address() );
			//console.log('----------insertData------------------',gettData)
			let group = await onboardingModel.add(gettData);
			// res.status(200).send(user1);
			//console.log('-------group---------',group)
			response.resp(res, 200, group)
			
				
	    } catch(exception) {
			// res.status(500).send(exception)
			response.resp(res, 500, exception)
	    }
	}

}

module.exports = new OnboardingCtrl();