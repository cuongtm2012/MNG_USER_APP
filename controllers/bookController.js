var validation = require('../util/validation');

exports.bookstatus = function (req, res) {
	var datebook = req.query.datebook;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT * FROM tland.M_STATUS_BOOK_BBQ WHERE DATE_BOOK=?', [datebook], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.bookfacility = function (req, res) {
	var reversation_id = req.body.reversation_id;
	var userid = req.body.userid;
	var starttime = req.body.starttime;
	var endtime = req.body.endtime;
	var pricebook = req.body.pricebook;
	var datebook = req.body.datebook;
	var commentbook = req.body.commentbook;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('INSERT INTO tland.M_RESERVATION_HIS VALUES (?,?,?,?,?,?,?,?,?)', [null,reversation_id, userid, starttime, endtime,pricebook, datebook,'New',commentbook], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				res.status(200).send(rows);
			}
		});
	});
};


exports.reservationhistory = function (req, res) {
	var id = req.query.id;
	var limit = parseInt(req.query.limit);
	var currentTotal = parseInt(req.query.currentTotal);
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		var QUERY_SELECT1 = "tland.M_RESERVATION.RESERVATION_NAME as RESERVATION_NAME,tland.M_RESERVATION.RESERVATION_ADDRESS as RESERVATION_ADDRESS, ";
		var QUERY_SELECT2 = "tland.M_RESERVATION.RESERVATION_PHONE as RESERVATION_PHONE,tland.M_RESERVATION_HIS.START_TIME as START_TIME,tland.M_RESERVATION_HIS.END_TIME as END_TIME,";
		var QUERY_SELECT3 = "tland.M_RESERVATION_HIS.ID_HIS as ID_HIS,tland.M_RESERVATION_HIS.DATE as DATE,tland.M_RESERVATION_HIS.USER_ID as USER_ID,tland.M_RESERVATION_HIS.PRICE as PRICE, tland.M_RESERVATION_HIS.STATUS as STATUS, tland.M_RESERVATION_HIS.NOTE as NOTE ";
		var QUERY_FROM = "FROM tland.M_RESERVATION INNER JOIN tland.M_RESERVATION_HIS ";
		var QUERY_ON = "ON tland.M_RESERVATION.RESERVATION_ID = tland.M_RESERVATION_HIS.RESERVATION_ID "
		conn.query('SELECT ' +QUERY_SELECT1 + QUERY_SELECT2 + QUERY_SELECT3 +QUERY_FROM + QUERY_ON + 'WHERE tland.M_RESERVATION_HIS.USER_ID = ? ORDER BY ID_HIS DESC LIMIT ?,?', [id,currentTotal,limit], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				if(err ===  null ) {
					res.status(403).send(err);
				} else {
					res.status(404).send();
				}
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.reservation = function (req, res) {
	var apt_id = parseInt(req.query.apt_id);
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT RESERVATION_NAME,RESERVATION_PRICE FROM tland.M_RESERVATION WHERE APT_ID = ?', apt_id, function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.reservationprice = function (req, res) {
	var apt_id = parseInt(req.query.apt_id);
	var reservation_name = req.query.reservation_name;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT RESERVATION_ID ,RESERVATION_PRICE FROM tland.M_RESERVATION WHERE APT_ID = ? AND RESERVATION_NAME = ?', [apt_id,reservation_name], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.reservationToday = function (req, res) {
	var id = req.query.id;
	var reservationid = req.query.reservationid;
	var datebook = req.query.datebook;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT tland.M_RESERVATION_HIS.START_TIME AS START_TIME,  tland.M_RESERVATION_HIS.END_TIME AS END_TIME FROM tland.M_RESERVATION_HIS WHERE USER_ID = ? AND RESERVATION_ID = ? AND DATE = ?', [id,reservationid,datebook], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};

exports.cancelbook = function (req, res) {
	var idbook = req.query.idbook;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('DELETE FROM tland.M_RESERVATION_HIS WHERE ID_HIS = ?', idbook, function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
	
};


exports.status = function (req, res) {
	table = req.query.table;
	var date = req.query.date;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT * FROM tland.STATUS_'+table+' WHERE DATE = ? ', [date], function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log("OK");
				res.status(200).send(rows);
			}
		});
	});
};
