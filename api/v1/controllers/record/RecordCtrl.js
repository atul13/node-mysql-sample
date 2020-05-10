/* controller to use for recording session */
const utils = require(process.cwd() + '/util/Utils');
const response = require(process.cwd() + '/util/Response');
const defaultConfig = require(process.cwd() + '/config/default.config');
const isEmpty = require("is-empty");
const underscore = require("underscore");
// const userModel = require('../../models/User');
const recordsModel = require('../../models/Records');
// const sessionModel = require('../../models/Session');
// const sessionScriptModel = require('../../models/SessionScript');

const AWS = require('aws-sdk');
const fs = require('fs');

const ID = process.env.ACCESS_KEY;
const SECRET = process.env.SECRET_KEY;
const REGION = process.env.REGION;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region:REGION
});

const saltRounds = 10;
class RecordCtrl {
	async uploadFile(request, res) {
    try {
        var mime = require('mime');
        var formidable = require('formidable');
        var util = require('util');
        var form = new formidable.IncomingForm();   

        var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';
        form.uploadDir = "./client/public"+dir;
        form.keepExtensions = true;
        form.maxFieldsSize = 10 * 1024 * 1024;
        form.maxFields = 1000;
        form.multiples = false;


       

        await form.parse(request, function(err, fields, files) {
            var file = util.inspect(files);
            console.log(file);
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "https://secure.seedocnow.com";
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = true;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
            headers["Content-Type"] = "application/json";


            var fileName = file.split('path:')[1].split('\',')[0].split(dir)[1].toString().replace(/\\/g, '').replace(/\//g, '');
           //console.log('---',fileName,process.cwd());
           // var fileURL = 'http://localhost:3001/uploads/' + fileName;
            var fileURL = process.cwd()+'/client/public/uploads/' + fileName;

             //slet fileContent = request.body.fileName;

            

                

            const fileContent = fs.readFileSync(fileURL);
            const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileContent
            };

            // Uploading files to the bucket
            s3.upload(params, function(err, data) {
                if (err) {
                   console.log(err);

                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });

            //response.resp(res, 200, fileURL)

            let insertData = [
                [fileName, fields.userId, fields.sessionId, 1 ]     
            ];
            console.log('----------insertedData------------------',insertData);

            let recordfile = recordsModel.addrecord(insertData);
            // res.status(200).send(user1);
            response.resp(res, 200, fileURL)
        });

            
			// res.status(200).send(user1);
			//response.resp(res, 200, user1)
				
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
	}
}

module.exports = new RecordCtrl();