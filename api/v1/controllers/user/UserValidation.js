const Validator = require("validator");
const isEmpty = require("is-empty");
const response = require(process.cwd() + '/util/Response');

class UserValidation {

	static login(req, res, next) {
		
		let data = req.body;
		let errors = {};
		let msg = '';
// console.log(data)
		// Convert empty fields to an empty string so we can use validator functions
		data.password = !isEmpty(data.password) ? data.password : "";

		// Name checks
		// if (Validator.isEmpty(data.name)) {
		// 	errors.name = "Name field is required";
		// }

		// Email checks
		if (!data.email || Validator.isEmpty(data.email)) {
			//errors.email = "Email field is required";
			msg = "Email field is required";
		} else if (!Validator.isEmail(data.email)) {
			//errors.email = "Email is invalid";
			msg = "Email is invalid";
		}
		
		// Password checks
		if (Validator.isEmpty(data.password)) {
			//errors.password = "Password field is required";

			msg = "Password field is required";

		}

		if(true != isEmpty(msg)){
			// res.status(400).json(errors);
			response.resp(res, 417, msg)
		} else {
			next()
		}
	}

	static register(req, res, next) {
		
		//let data = req.body.participentDetail;
		let data = req.body;
		let errors = {};
		let msg = '';
		//console.log('---------data--------------------',data)
		// Convert empty fields to an empty string so we can use validator functions
		data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
		data.lastName = !isEmpty(data.lastName) ? data.lastName : "";

		// Name checks
		if (Validator.isEmpty(data.firstName)) {
			//errors.firstName = "First name is required";
			msg = "First name is required";
		}

		if (Validator.isEmpty(data.lastName)) {
			//errors.lastName = "Last name is required";
			msg = "Last name is required";
		}

		// Password check
		if (Validator.isEmpty(data.password)) {
			//errors.password = "Password is required";

			msg = "Password is required";
		}

		// if (Validator.isEmpty(data.phone)) {
		// 	errors.phone = "Mobile is required";
		// }
		
		// Email checks
		if (!data.email || Validator.isEmpty(data.email)) {
			//errors.email = "Email is required";
			msg = "Email is required";
		} else if (!Validator.isEmail(data.email)) {
			//errors.email = "Email is invalid";

			msg = "Email is invalid";
		}

		if(true != isEmpty(msg)){
			// res.status(400).json(errors);
			response.resp(res, 417, msg)
		} else {
			next()
		}
	}
	static verifyOtp(req, res, next) {
		let data = req.body;
		let errors = {};
		let msg = '';
		// Convert empty fields to an empty string so we can use validator functions
		let code = !isEmpty(data.code) ? data.code : "";

		// Name checks
		if (Validator.isEmpty(code)) {
			//errors.code = "Verification code is required";
			msg = "Verification code is required";
		}

		if(true != isEmpty(msg)){
			// res.status(400).json(errors);
			response.resp(res, 417, msg)
		} else {
			next()
		}
	}
}

module.exports = UserValidation;