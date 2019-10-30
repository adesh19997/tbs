const functions = require('firebase-functions');
var express = require('express');
const firebase = require("firebase");
var app = express();
const checksum_lib = require('./checksum');
firebase.initializeApp({
	apiKey: 'AIzaSyAHdBM-Y1cnQ2ZATN3sdAv01SDc3SNo3Ws',
	authDomain: 'tecpixels-bs.firebaseapp.com',
	databaseURL: 'https://tecpixels-bs.firebaseio.com',
	projectId: 'tecpixels-bs',
	storageBucket: 'gs://tecpixels-bs.appspot.com/'
});
app.use(express.json());

var cors = require('cors');
app.use(cors());

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

app.post('/checksum', function (req, res) {
	checksum_lib.genchecksum(req.body.Params, "BzCxdUD6wWkUbeSm", function (err, checksum) {
		if (checksum) {
			res.end(JSON.stringify(checksum));
		} else {
			res.end(JSON.stringify(err));
		}
	})

});

app.post('/myorders', function (req, res) {
	let myOrders = [];
	firebase.database().ref('/Orders').once('value', function (snapshot) {
		Orders = snapshot.val();
		let orderKeys = Object.keys(Orders);
		for (var j = 0; j < orderKeys.length; j++) {
			if (Orders[orderKeys[j]].sCustomerId == req.body.sPhoneNumber) {
				myOrders.push(Orders[orderKeys[j]]);
			}
		}
		res.end(JSON.stringify(myOrders));
	})
		.catch(function (error) {
			res.end(JSON.stringify(error));
		})
});

app.post('/getpromocodes', function (req, res) {
	let response = [];
	firebase.database().ref('/Promocodes').once('value', function (snapshot) {
		Promocodes = snapshot.val();
		let today = new Date()
		for (var j = 0; j < Promocodes.length; j++) {
			Promocodes[j].dStartDate = new Date(Promocodes[j].dStartDate);
			Promocodes[j].dEndDate = new Date(Promocodes[j].dEndDate);
			if (Promocodes[j].dStartDate <= today <= Promocodes[j].dEndDate) {
				if (Promocodes[j].dMinAmount <= req.body.dOrderAmount || Promocodes[j].dMinAmount == -1) {
					if (Promocodes[j].dMaxOrder >= req.body.OrderNo || Promocodes[j].dMaxOrder == -1) {
						if (Promocodes[j].dMinOrder <= req.body.OrderNo || Promocodes[j].dMinOrder == -1) {
							if (Promocodes[j].sUnit == "PERCENT") {
								let subtractAmt = Math.floor(req.body.dOrderAmount * (Promocodes[j].dAmount / 100));
								let promAmount = req.body.dOrderAmount - subtractAmt;
								if (promAmount > Promocodes[j].dMaxLimit) {
									promAmount = Promocodes[j].dMaxLimit
								}
								response.push({
									"sName": Promocodes[j].sName,
									"sDescription": Promocodes[j].sDescription,
									"dPromotionAmount": promAmount
								})
							} else if (Promocodes[j].sUnit == "AMOUNT") {
								let promAmount = req.body.dOrderAmount - Promocodes[j].dAmount;
								if (promAmount > Promocodes[j].dMaxLimit) {
									promAmount = Promocodes[j].dMaxLimit
								}
								response.push({
									"sName": Promocodes[j].sName,
									"sDescription": Promocodes[j].sDescription,
									"dPromotionAmount": promAmount
								})
							}
						}
					}
				}
				if (Promocodes[j].aProducts) {
					if (Promocodes[j].aProducts.includes(req.body.sProduct)){
						response.push({
							"sName": Promocodes[j].sName,
							"sDescription": Promocodes[j].sDescription,
							"dPromotionAmount": promAmount
						})
					}
				}
			}
		}
		res.end(JSON.stringify(response));
	})
		.catch(function (error) {
			res.end(JSON.stringify(error));
		})
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

app.post('/calculateDeliveryCharge', function (req, res) {

	var request = require("request");

	var options = {
		method: 'POST',
		url: 'https://robotapitest.wefast.in/api/business/1.1/calculate-order',
		headers:
		{
			'postman-token': '939efdf4-2af3-ed45-3792-2639c254cb9a',
			'cache-control': 'no-cache',
			'content-type': 'application/json',
			'x-dv-auth-token': 'EFAFD8ABF63D45876D2BF353C562AC1C2B53F564'
		},
		body: req.body,
		json: true
	};

	request(options, function (error, response, body) {
		if (error) {
			res.end(JSON.stringify(error));
		} else {
			res.end(JSON.stringify(body));
		}
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
