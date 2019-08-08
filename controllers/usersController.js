var validation = require('../util/validation');
var config = require('./../../share/config');

exports.isID = function (req, res) {
	var id = req.query.id;
	var QUERY_SELECT = 'SELECT a.M_USER_ID, a.M_USER_MOBILENO, a.M_USER_PIN, a.M_USER_STATUS, a.DEVICE_ID, b.EMAIL ';
	var QUERY_FROM = ' FROM tland.M_USER a INNER JOIN tland.CM_RESIDENT b ON a.M_USER_ID = b.M_USER_ID WHERE a.M_USER_ID = ? ';
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query(QUERY_SELECT + QUERY_FROM, id, function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};



exports.isPinner = function (req, res) {
	var id = req.body.id;
	var pin = req.body.pin;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT * FROM tland.M_USER WHERE M_USER_ID = ? and M_USER_PIN = ?', [id, pin], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
}

exports.isResetPin = function (req, res) {
	var id = req.body.id;
	var mobileNo = req.body.mobileNo;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT * FROM tland.M_USER WHERE M_USER_ID = ? and M_USER_MOBILENO = ?', [id, mobileNo], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.updatePin = function (req, res) {
	var pin = req.body.pin;
	var id = req.body.id;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('UPDATE tland.M_USER set M_USER_PIN = ? WHERE M_USER_ID = ? ', [pin, id], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.updatePinFirstTime = function (req, res) {
	var pin = req.body.pin;
	var statususer = req.body.statususer;
	var userid = req.body.userid;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('UPDATE tland.M_USER set M_USER_PIN = ?,M_USER_ACTIVE = ? WHERE M_USER_ID = ?', [pin, statususer, userid], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.login = function (req, res) {
	var jwt = require('jsonwebtoken');
	var id = req.body.id;
	var pin = req.body.pin;
	req.getConnection(function (error, conn) {
		var payload = {
			id: id,
			pin: pin
		};
		var token = jwt.sign(payload, config.secret, {
			expiresIn: config.expiresIn
		});
		if (!conn) {
			res.status(404).send();
			return;
		}
		var QUERY_SELECT = 'SELECT tland.CM_RESIDENT.APT_ID, tland.BA_APT.APT_NM, tland.CM_RESIDENT.TEL1, tland.CM_RESIDENT.TEL2, tland.CM_RESIDENT.HO1, tland.CM_RESIDENT.HO2, tland.CM_RESIDENT.HO3, DATE_FORMAT(tland.CM_RESIDENT.I_DATE, "%d/%m/%Y") as I_DATE, DATE_FORMAT(tland.CM_RESIDENT.O_DATE, "%d/%m/%Y") as O_DATE, tland.CM_RESIDENT.RESIDENT_NM, tland.CM_RESIDENT.IS_CONTRACTOR, tland.CM_RESIDENT.RENTAL_TP, tland.CM_RESIDENT.EMAIL, tland.CM_RESIDENT.NATION_NM, tland.CM_RESIDENT.GEN_TP, tland.CM_RESIDENT.IDCARD_NO, tland.M_USER.M_USER_ID ';
		var QUERY_FROM = ' FROM tland.M_USER JOIN tland.CM_RESIDENT ON tland.M_USER.M_USER_ID = tland.CM_RESIDENT.M_USER_ID  ';
		var QUERY_JOIN = ' JOIN tland.BA_APT ON tland.BA_APT.APT_ID = tland.CM_RESIDENT.APT_ID ';
		var QUERY_WHERE = ' AND tland.M_USER.M_USER_ID = ? and tland.M_USER.M_USER_PIN = ?';

		conn.query(QUERY_SELECT + QUERY_FROM + QUERY_JOIN + QUERY_WHERE, [id, pin], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log("OK");
				res.status(200).send({
					auth: true,
					token: token,
					rows: rows
				});
			}
		});
	});
};


exports.updateprofile = function (req, res) {
	var userId = req.body.userId;
	var idpp = req.body.idppd;
	var tel1 = req.body.tel1;
	var tel2 = req.body.tel2;
	var email = req.body.email;

	req.getConnection(function (error, conn) {
		conn.query('UPDATE tland.CM_RESIDENT SET IDCARD_NO = ?, TEL1 = ?, TEL2 = ?, EMAIL = ? WHERE USER_ID = ?',
			[idpp, tel1, tel2, email, userId],
			function (err, rows, fields) {
				if (err || validation.isEmptyJson(rows)) {
					console.log(err);
					res.status(404).json({
						'msg': err
					});
				} else {
					console.log("OK");
					res.status(200).send({
						rows: rows
					});
				}
			});
	});
};