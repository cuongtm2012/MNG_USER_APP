var validation = require('../util/validation');

exports.list = function (req, res) {
	var user_id = req.body.user_id;
	var num_per_page = req.body.num_per_page;
	var last_date = req.body.last_date;
	var user_type = parseInt(req.body.user_type);
	var search_text= req.body.search_text;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}

		if (last_date == '') {
			var query = '';
			var isQueryValid = false;
			var values = [];

			if (user_type === 0) {
				query = 'SELECT * FROM tland.M_PUSH_MSG_HIS WHERE RESIDENT_USER_ID=?';
				isQueryValid = true;
			}
			else if (user_type === 1) {
				query = 'SELECT * FROM tland.M_PUSH_MSG_HIS WHERE MANAGER_USER_ID=?';
				isQueryValid = true;
			}

			if (search_text !== '') {
				search_text = '%' + search_text + '%';
				query += ' AND (SENDER_NM LIKE ? OR MSG_TITLE LIKE ? OR MSG_CONTENT LIKE ?)';
				values = [user_id, search_text, search_text, search_text, num_per_page];
			}
			else {
				values = [user_id, num_per_page]
			}

			query += ' ORDER BY REQ_DT DESC LIMIT ?';

			if (!isQueryValid) {
				res.status(404).send();
				return;
			}

			conn.query(query, values, function (err, rows, fields) {
				if (err) {
					console.log(err);
					res.status(404);
					res.send();
				} else {
					console.log("OK");
					res.status(200).send(rows);
				}
			});
		}
		else {
			var query = '';
			var isQueryValid = false;
			var values = [];

			if (user_type === 0) {
				query = 'SELECT * FROM tland.M_PUSH_MSG_HIS WHERE RESIDENT_USER_ID=? AND REQ_DT < ?';
				isQueryValid = true;
			}
			else if (user_type === 1) {
				query = 'SELECT * FROM tland.M_PUSH_MSG_HIS WHERE MANAGER_USER_ID=? AND REQ_DT < ?';
				isQueryValid = true;
			}

			if (search_text !== '') {
				search_text = '%' + search_text + '%';
				query += ' AND (SENDER_NM LIKE ? OR MSG_TITLE LIKE ? OR MSG_CONTENT LIKE ?)';
				values = [user_id, last_date, search_text, search_text, search_text, num_per_page];
			}
			else {
				values = [user_id, last_date, num_per_page]
			}

			query += ' ORDER BY REQ_DT DESC LIMIT ?';

			if (!isQueryValid) {
				res.status(404).send();
				return;
			}

			conn.query(query, values, function (err, rows, fields) {
				if (err) {
					console.log(err);
					res.status(404);
					res.send();
				} else {
					console.log("OK");
					res.status(200).send(rows);
				}
			});
		}
	});
};

exports.count = function (req, res) {
	var user_id = req.body.user_id;
	var user_type = parseInt(req.body.user_type);
	var canGetLatest = req.body.canGetLatest === 1;
	var numberOfLatest = req.body.numberOfLatest;
	
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		
		var query = '';
		
		if (user_type === 0) {
			query = 'SELECT count(PUSH_ID) count FROM tland.M_PUSH_MSG_HIS WHERE RESIDENT_USER_ID=?';
		}
		else if (user_type === 1) {
			query = 'SELECT count(PUSH_ID) count FROM tland.M_PUSH_MSG_HIS WHERE MANAGER_USER_ID=?';
		}

		if (query === '') {
			console.log('null query');
			res.status(404).send();
			return;
		}

		conn.query(query, [user_id], function (err, resultCount, fields) {
			if (err) {
				console.log(err);
				res.status(404);
				res.send();
			} else {
				if (canGetLatest) {
					exports.getLatest(conn, user_type, user_id, numberOfLatest, () => {
						res.status(404).send();
					}, (resultLatest) => {
						res.status(200).send({count:resultCount, latest: resultLatest});
					})
				} else {
					res.status(200).send({count:resultCount});
				}
			}
		});
	});
};

exports.getLatest = function(conn, userType, userId, limit, onError, onSuccess) {
	if (userType === 0) {
		query = 'SELECT * FROM tland.M_PUSH_MSG_HIS WHERE RESIDENT_USER_ID=? ORDER BY REQ_DT DESC LIMIT ?';
	}
	else if (userType === 1) {
		query = 'SELECT * FROM tland.M_PUSH_MSG_HIS WHERE MANAGER_USER_ID=? ORDER BY REQ_DT DESC LIMIT ?';
	}

	conn.query(query, [userId, limit], function (err, rows, fields) {
		if (err) {
			onError(err);
		} else {
			onSuccess(rows);
		}
	});
}