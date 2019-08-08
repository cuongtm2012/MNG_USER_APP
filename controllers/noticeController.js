var validation = require('../util/validation');

exports.notice = function (req, res) {
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.sendStatus(404);
			res.end();
			return;
		}

		conn.query('SELECT ID_M_NOTICE FROM tland.M_NOTICE', function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				res.status(200).send(rows);
			}
		});
	});
};

exports.noticeimage = function (req, res) {
	var fs = require('fs');
	var idImage = req.query.idImage;
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.sendStatus(404);
			res.end();
			return;
		}
		conn.query('SELECT M_NOTICE_IMAGE FROM tland.M_NOTICE WHERE ID_M_NOTICE = ' + idImage, function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.sendStatus(404);
				res.end();
			} else {
				var readStream = fs.createReadStream(rows[0].M_NOTICE_IMAGE);
				readStream.on('error', function (err) {
					console.log(err);
					res.sendStatus(404);
					res.end();
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