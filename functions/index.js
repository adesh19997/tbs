const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
var express = require('express');
var app = express();
app.use(express.json());
app.use(cors);
app.post('/sendEmail', function (req, res) {;
	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({
	 service: 'Gmail',
	 auth: {
		user: 'adesh19997@gmail.com',
		pass: 'Softcell@2019'
	    }
	});
	var mailDetails = req.body.mailDetails;
	const mailOptions = {
	  from: 'adesh19997@gmail.com', // sender address
	  to: mailDetails.sEmail, // list of receivers
	  subject: mailDetails.sSubject, // Subject line
	  html: mailDetails.sContent// plain text body
	};

	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     res.end( JSON.stringify(err));
	   else
	     res.end( JSON.stringify(info));
	});
})
exports.app = functions.https.onRequest(app);
