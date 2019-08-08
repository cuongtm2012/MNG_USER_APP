var validation = require('../util/validation');

exports.allfee = function (req, res) {
	var id = req.query.id;
	var select_query = 'SELECT * FROM tland.CO_COST_READ AS a ';
	var join_query = ' JOIN tland.CM_RESIDENT AS b ON a.APT_ID = b.APT_ID AND a.HO1 = b.HO1 AND a.HO2 = b.HO2 AND a.HO3 = b.HO3 ';
	var where_query = ' WHERE b.M_USER_ID = ?';
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query(select_query + join_query + where_query, id, function (err, rows, fields) {
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