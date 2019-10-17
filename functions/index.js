const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
var express = require('express');
const firebase = require("firebase");
var app = express();
firebase.initializeApp({
	apiKey: 'AIzaSyAHdBM-Y1cnQ2ZATN3sdAv01SDc3SNo3Ws',
	authDomain: 'tecpixels-bs.firebaseapp.com',
	databaseURL: 'https://tecpixels-bs.firebaseio.com',
	projectId: 'tecpixels-bs',
	storageBucket: 'gs://tecpixels-bs.appspot.com/'
});
app.use(express.json());
app.use(cors);
app.post('/sendEmail', function (req, res) {
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
		if (err)
			res.end(JSON.stringify(err));
		else
			res.end(JSON.stringify(info));
	});
});

app.post('/getFilteredProducts', function (req, res) {
	firebase.database().ref('/Products').once('value', function (snapshot) {
		Products = snapshot.val();
		var filterKeys = Object.keys(req.body.filterParams);
		let prodKeys = Object.keys(Products);
		var ProdList = []
		for (var j = 0; j < prodKeys.length; j++) {
			let bAdd = true;
			for (var i = 0; i < filterKeys.length; i++) {
				if (typeof Products[prodKeys[j]][filterKeys[i]] == "string") {
					if (Products[prodKeys[j]][filterKeys[i]] != req.body.filterParams[filterKeys[i]]) {
						bAdd = false;
					}
				} else if (Array.isArray(Products[prodKeys[j]][filterKeys[i]])) {
					if (!Products[prodKeys[j]][filterKeys[i]].includes(req.body.filterParams[filterKeys[i]])) {
						bAdd = false;
					}
				}
			}

			if (bAdd) {
				ProdList.push(Products[prodKeys[j]])
			}
		}
		res.end(JSON.stringify(ProdList));
	})
		.catch(function (error) {
			res.end(JSON.stringify(error));
		});
});

app.post('/basicAnalysis', function (req, res) {
	let Products = [];
	let Orders = [];
	let Stock = [];
	let responseData = {
		dTotalSold: 0,
		dTotalProducts: 0,
		dTotalStock: 0,
		dOrderToBeShipped: 0,
		dOrderOnWay: 0,
		dOrderDelivery: 0,
		dOrderDelivered: 0,
		dOrderCancelled: 0,
		aMaxStockProd: [],
		aMinStockProd: [],
		aMostSold: [],
		aLeastSold: [],
		dOrderPlaced: 0
	};
	firebase.database().ref('/Products').once('value', function (snapshot) {
		Products = snapshot.val();
		firebase.database().ref('/Orders').once('value', function (snapshot) {
			Orders = snapshot.val();
			firebase.database().ref('/Stocks').once('value', function (snapshot) {
				Stock = snapshot.val();
				let prodKeys = Object.keys(Products);
				let orderKeys = Object.keys(Orders);
				let stockKeys = Object.keys(Stock);
				responseData.dTotalProducts = prodKeys.length;
				console.log("inside 1");
				for (var i = 0; i < prodKeys.length; i++) {
					if (Products[prodKeys[i]].dStockAvailable) {
						responseData.dTotalStock += Number(Products[prodKeys[i]].dStockAvailable);
					}
					if (responseData.aMaxStockProd.length == 0 && responseData.dStockAvailable) {
						responseData.aMaxStockProd.push(Products[prodKeys[i]].sName + "-" + Products[prodKeys[i]].dStockAvailable.toString());
					} else if (responseData.aMaxStockProd > 0) {
						let max1 = responseData.aMaxStockProd[0].split("-")[1];
						if (Number(Products[prodKeys[i]].dStockAvailable) > max1) {
							responseData.aMaxStockProd[0] = Products[prodKeys[i]].sName + "-" + Products[prodKeys[i]].dStockAvailable.toString();
						}
					}
					if (responseData.aMinStockProd.length == 0 && responseData.dStockAvailable) {
						responseData.aMinStockProd.push(Products[prodKeys[i]].sName + "-" + Products[prodKeys[i]].dStockAvailable.toString());
					} else if (responseData.aMinStockProd > 0) {
						let min1 = responseData.aMinStockProd[0].split("-")[1];
						if (Number(Products[i].dStockAvailable) < min1) {
							responseData.aMinStockProd[0] = Products[prodKeys[i]].sName + "-" + Products[prodKeys[i]].dStockAvailable.toString();
						}
					}
				}
				for (var j = 0; j < stockKeys.length; j++) {
					if (Stock[stockKeys[j]].sAction == "Sold") {
						responseData.dTotalSold += Number(Stock[stockKeys[j]].dQuantity);
					}
				}
				for (var i = 0; i < orderKeys.length; i++) {
					if (Orders[orderKeys[i]].sOrderStatus == "OS2") {
						responseData.dOrderToBeShipped += 1;
					}
					if (Orders[orderKeys[i]].sOrderStatus == "OS6") {
						responseData.dOrderDelivered += 1;
					}
					if (Orders[orderKeys[i]].sOrderStatus == "OS7") {
						responseData.dOrderCancelled += 1;
					}
					if (Orders[orderKeys[i]].sOrderStatus == "OS4") {
						responseData.dOrderOnWay += 1;
					}
					if (Orders[orderKeys[i]].sOrderStatus == "OS5") {
						responseData.dOrderDelivery += 1;
					}
					if (Orders[orderKeys[i]].sOrderStatus == "OS1") {
						responseData.dOrderPlaced += 1;
					}
				}
				res.end(JSON.stringify(responseData));
			})
				.catch(function (error) {
					res.end(JSON.stringify(error));
				});
		})
			.catch(function (error) {
				res.end(JSON.stringify(error));
			});
	})
		.catch(function (error) {
			res.end(JSON.stringify(error));
		});
})
exports.app = functions.https.onRequest(app);
