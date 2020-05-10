const response = require(process.cwd() + '/util/Response');
var fs = require('fs');

class LogsCtrl {

	async createLog(req, res) {
	    try {

	    	let date_ob = new Date();
	    	
	    	let date = ("0" + date_ob.getDate()).slice(-2);
	    	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	    	let year = date_ob.getFullYear();

	    	let hours = ("0" + date_ob.getHours()).slice(-2);
	    	let minutes = ("0" + date_ob.getMinutes()).slice(-2);
	    	let seconds = ("0" + date_ob.getSeconds()).slice(-2);

			let currentDate = year + '-' + month + '-' + date;

			var dir = process.cwd() + '/logs/' + currentDate;

			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir);

			    let text = currentDate + ' ' + hours + ':' + minutes + ':' + seconds + ':' + date_ob.getMilliseconds() + '   ' + req.body.text + '\r\n';
			    var sessionDir = process.cwd() + '/logs/' + currentDate + '/';

				fs.appendFile(sessionDir + req.body.sessionName+".log", text, function (err) {
				  	if (err) throw err;
				  	
				  	response.resp(res, 200);
				});
			} else {

				let text = currentDate + ' ' + hours + ':' + minutes + ':' + seconds + ':' + date_ob.getMilliseconds() + '   ' + req.body.text + '\r\n';
				var sessionDir = process.cwd() + '/logs/' + currentDate + '/';

				fs.appendFile(sessionDir + req.body.sessionName+".log", text, function (err) {
					  if (err) throw err;
					  
					  response.resp(res, 200);
				});
			}
				
	    } catch(exception) {
			// res.status(500).send(exception)
			//response.resp(res, 500, exception)
	    }
	}

}

module.exports = new LogsCtrl();