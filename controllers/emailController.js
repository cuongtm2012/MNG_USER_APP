var validation = require('../util/validation');
var config = require('./../../share/config');
var nodemailer = require("nodemailer");
var redisClient = require('../redis/redisClient');
var PINCODE_PREFIX = '_pincode';
exports.send = function (req, res) {
	var pincode = Math.floor(100000 + Math.random() * 900000);
	var smtpTransport = nodemailer.createTransport({
		service: config.email.service,
		auth: {
			user: config.email.user,
			pass: config.email.password
		}
	});
	mailOptions = {
		to: req.query.to,
		subject: config.email.header,
		html: config.email.body + pincode
	}
	console.log(mailOptions);
	redisClient.set(req.query.to + PINCODE_PREFIX, pincode, function (err, reply) {
		if (err) {
			console.log('Store pincode error : ' + err);
		} else {
			smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
					console.log(error);
					res.end("error");
				} else {
					console.log("Message sent: " + response);
					res.end("sent");
				}
			});
		}
		console.log('Store pincode : ' + reply);
	});
};

exports.pincode = function (req, res) {
	var email = req.query.email;
	redisClient.get(email + PINCODE_PREFIX, function (err, reply) {
		console.log(reply);
		if (err) {
			res.status(404).send(err);
		}
		if (validation.isEmptyStr(reply)) {
			res.status(404).send('');
		} else {
			res.status(200).send(reply);
		}
	});
};