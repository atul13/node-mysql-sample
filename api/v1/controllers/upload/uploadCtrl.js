/* controller to use for recording session */
const utils = require(process.cwd() + '/util/Utils');
const response = require(process.cwd() + '/util/Response');
const defaultConfig = require(process.cwd() + '/config/default.config');
const axios = require("axios");
const isEmpty = require("is-empty");
const underscore = require("underscore");
var http = require('http');
const path = require("path");
var formidable = require('formidable');
const express = require('express');
var cors = require("cors")
const app = express();
const fileUpload = require('express-fileupload');
app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(process.cwd() + '/admin' + '/public' + '/upload' + '/uploadImage'));

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

class uploadCtrl {
	async upload(req, res) {
    try {
      let userId=req.currentUser.id;
      const uploadPath= process.cwd() + '/admin' + '/public' + '/upload' + '/uploadImage/';

      console.log('--------req--------',req);
      let imageFile = req.files.file;
      console.log('--------imageFile--------',imageFile.name);
     let imgName111= imageFile.name.split('.');
     console.log('--------imgName111--------',imgName111[0]);
     let imageSize = req.files.file.size;
      let date11111= new Date();
      let time = date11111.getTime();
      let time1 = userId+time;
		
      let tempImgName=imgName111[0]+time1+'.'+imgName111[1];
      console.log('--------tempImgName--------',tempImgName);

      let imageData = req.files.file.data;

      const params = {
        Bucket: BUCKET_NAME,
        Key: tempImgName,
        Body: imageData
        };
        console.log('--------params---------',params)
        // Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {
               console.log(err);

            }  
            console.log(`File uploaded successfully1111111. ${data.Location}`);
            response.resp(res, 200, {file: `${data.Location}`})
        });

       

      // imageFile.mv(`${process.cwd()}/admin/public/upload/uploadImage/${tempImgName}`, function(err) {
      //   if (err) {
      //    // return res.status(500).send(err);
      //    console.log('------err------------',err)
      //    response.resp(res, 417, {err: err})
      //   }

      //   response.resp(res, 200, {file: `/upload/uploadImage/${tempImgName}`})
      // });
      				
	    } catch(exception) {
			response.resp(res, 500, exception)
	    }
  }
  

}

module.exports = new uploadCtrl();