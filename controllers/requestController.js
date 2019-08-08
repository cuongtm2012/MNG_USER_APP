var validation = require('../util/validation');

exports.request = function (req, res) {
	var namerequest = req.body.namerequest;
	var contentrequest = req.body.contentrequest;
	var userid = req.body.userid;
	var status = req.body.status;
	var date = req.body.date;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('INSERT INTO tland.M_REQUEST_MANAGEMENT VALUES(?,?,?,?,?,?)', [null, namerequest, contentrequest, userid, status, date], function (err, rows, fields) {
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

exports.requestmanagement = function (req, res) {
	var id = req.query.id;
	var currentTotal = parseInt(req.query.currentTotal);
	var limit = parseInt(req.query.limit);
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT tland.M_REQUEST_MANAGEMENT.ID_REQUEST AS ID_REQUEST,tland.M_REQUEST_MANAGEMENT.CONTENT_REQUEST AS CONTENT_REQUEST,tland.M_REQUEST_MANAGEMENT.STATUS AS STATUS,tland.M_REQUEST_MANAGEMENT.USER_ID AS USER_ID,tland.M_TYPE_REQUEST.NAME_REQUEST AS NAME_REQUEST FROM tland.M_REQUEST_MANAGEMENT INNER JOIN tland.M_TYPE_REQUEST ON tland.M_REQUEST_MANAGEMENT.ID_TYPE_REQUEST = tland.M_TYPE_REQUEST.ID_TYPE_REQUEST WHERE USER_ID = ? ORDER BY tland.M_REQUEST_MANAGEMENT.ID_REQUEST DESC LIMIT ?,?', [id, currentTotal, limit], function (err, rows, fields) {
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

exports.cancleRequest = function (req, res) {
	var idrequest = req.query.idrequest;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
		return;
		}
		conn.query('DELETE FROM tland.M_REQUEST_MANAGEMENT WHERE ID_REQUEST = ?', idrequest, function (err, rows, fields) {
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

exports.complaintmanagement = function (req, res) {
	var id = req.query.id;
	var currentTotal = parseInt(req.query.currentTotal);
	var limit = parseInt(req.query.limit);
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT tland.M_COMPLAINT_MANAGEMENT.NAME_MANAGEMENT AS NAME_MANAGEMENT, tland.M_COMPLAINT_MANAGEMENT.CONTENT AS CONTENT_COMPLAINT, tland.M_REQUEST_MANAGEMENT.CONTENT_REQUEST AS CONTENT_REQUEST, tland.M_COMPLAINT_MANAGEMENT.DATE_COMPLAINT AS DATE_COMPLAINT, tland.M_TYPE_REQUEST.NAME_REQUEST AS NAME_REQUEST FROM tland.M_COMPLAINT_MANAGEMENT INNER JOIN tland.M_REQUEST_MANAGEMENT ON tland.M_COMPLAINT_MANAGEMENT.ID_REQUEST = tland.M_REQUEST_MANAGEMENT.ID_REQUEST INNER JOIN tland.M_TYPE_REQUEST ON tland.M_REQUEST_MANAGEMENT.ID_TYPE_REQUEST = tland.M_TYPE_REQUEST.ID_TYPE_REQUEST WHERE USER_ID = ? ORDER BY tland.M_COMPLAINT_MANAGEMENT.ID_COMPLAINT DESC LIMIT ?,?', [id, currentTotal, limit], function (err, rows, fields) {
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

exports.cancleComplaint = function (req, res) {
	var idcomplaint = req.query.idcomplaint;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('DELETE FROM tland.M_COMPLAINT_MANAGEMENT WHERE ID_COMPLAINT = ?', idcomplaint, function (err, rows, fields) {
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







