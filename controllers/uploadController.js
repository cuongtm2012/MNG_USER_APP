var config = require('./../../share/config');
var validation = require('../util/validation');

exports.saveimage = function (req, res) {
	var imageName = req.body.imageName;
	var userId = req.body.userId;
	var dateTime = new Date().toLocaleDateString();
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query(" INSERT INTO tland.M_IMAGE_UPLOAD (M_IMAGE_NAME, M_USER_ID, M_DATE_TIME) VALUES (?,?,?) ", [imageName, userId, dateTime], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(404).send(err);
			} else {
				res.status(200).send(rows);
			}
		});
	});
};

exports.updateimage = function (req, res) {
	var imageName = req.body.imageName;
	var userId = req.body.userId;
	var dateTime = new Date().toLocaleDateString();
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query(" UPDATE tland.M_IMAGE_UPLOAD SET tland.M_IMAGE_UPLOAD.M_IMAGE_NAME = ?, tland.M_IMAGE_UPLOAD.M_DATE_TIME = ? WHERE tland.M_IMAGE_UPLOAD.M_USER_ID = ? ", [imageName, dateTime, userId], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(404).send(err);
			} else {
				res.status(200).send(rows);
			}
		});
	});
};

exports.isexistimage = function (req, res) {
	var userId = req.body.userId;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query(" SELECT M_IMAGE_ID FROM tland.M_IMAGE_UPLOAD WHERE M_USER_ID = ? ", [userId], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(404).send(err);
			} else {
				console.log(rows);
				res.status(200).send(rows);
			}
		});
	});
};

exports.profileimage = function (req, res) {
	var fs = require('fs');
	var userid = req.query.userid;
	
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.sendStatus(404);
			return;
		}
		conn.query('SELECT M_IMAGE_NAME FROM tland.M_IMAGE_UPLOAD WHERE M_USER_ID = ?', [userid], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.sendStatus(404);
				res.end();
			} else {
				var readStream = fs.createReadStream(rows[0].M_IMAGE_NAME);
				readStream.on('error', function (err) {
					console.log(err);
					res.sendStatus(404);
					return null;
				});

				readStream.on('open', function () {
					res.writeHead(200);
					console.log('Write Image To Res');
					return readStream.pipe(res);
				});
			}
		});
	});
};