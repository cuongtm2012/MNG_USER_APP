var validation = require('../util/validation');

exports.updateUser = function(userType, conn, res, deviceId, userId) {
    console.log('updateUser')
    if (userType === '0') {
        // Resident
        conn.query("UPDATE tland.M_USER SET DEVICE_ID =? WHERE M_USER_ID =?", [deviceId, userId], function (err, rows) {
            console.log(err, rows, deviceId, userId);
            res.status(200).send(rows);
        });
    }
    else if (userType === '1') {
        // Manager
        conn.query("UPDATE tland.BA_USER SET DEVICE_ID =? WHERE USER_ID =?", [deviceId, userId], function (err, rows) {
            res.status(200).send(rows);
        });
    }
}

exports.registerDevice = function (req, res) {
    var deviceId = req.body.deviceId;
    var deviceType = req.body.deviceType;
    var deviceName = req.body.deviceName;
    var deviceVersion = req.body.deviceVersion;
    var deviceToken = req.body.deviceToken;
    var deviceLastLogin = req.body.deviceLastLogin;
    var deviceIp = req.body.deviceIp;
    var userId = req.body.userId;
    var userType = req.body.userType;
    req.getConnection(function (error, conn) {
        if (!conn) {
            res.status(404).send();
            return;
        }

        // Need to check DEVICE_ID exist or not, if exist then need update DEVICE_TOKEN_ID
        conn.query(" SELECT DEVICE_ID FROM tland.M_DEVICE WHERE DEVICE_ID=?", [deviceId], function (err, rows) {
            if (!err && !validation.isEmptyJson(rows)) {
                // Update DEVICE here
                conn.query(" UPDATE tland.M_DEVICE SET DEVICE_ID=?, DEVICE_TP=?, DEVICE_NM=?, DEVICE_IP=?, DEVICE_TOKEN_ID=?, DEVICE_VERSION=?, DEVICE_LATEST_LOGIN=? WHERE DEVICE_ID=? ", [deviceId, deviceType, deviceName, deviceIp, deviceToken, deviceVersion, deviceLastLogin, deviceId], function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(404).send(err);
                    } else {
                        console.log('update device');
                        module.exports.updateUser(userType, conn, res, deviceId, userId);
                    }
                });
            } else {
                // Insert new DEVICE here
                conn.query(" INSERT INTO tland.M_DEVICE (DEVICE_ID, DEVICE_TP, DEVICE_NM, DEVICE_IP, DEVICE_TOKEN_ID, DEVICE_VERSION, DEVICE_LATEST_LOGIN) VALUES (?,?,?,?,?,?,?) ", [deviceId, deviceType, deviceName, deviceIp, deviceToken, deviceVersion, deviceLastLogin], function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(404).send(err);
                    } else {
                        console.log('insert new device');
                        module.exports.updateUser(userType, conn, res, deviceId, userId);
                    }
                });
            }
        });
    });
};

exports.registerNoti = function (req, res) {
    var deviceType = req.body.deviceType;
    var notiTitle = req.body.notiTitle;
    var notiContent = req.body.notiContent;
    var dateTime = req.body.dateTime;
    var notiType = req.body.notiType;
    req.getConnection(function (error, conn) {
        if (!conn) {
            res.status(404).send();
            return;
        }

        conn.query(" INSERT INTO tland.M_PUSH_MSG (DEVICE_TP, MSG_TP, MSG_TITLE, MSG_CONTENT, REQ_DT) VALUES (?,?,?,?,?) ", [deviceType, notiType, notiTitle, notiContent, dateTime], function (err, rows) {
            if (err) {
                console.log(err);
                res.status(404).send(err);
            } else {
                res.status(200).send(rows);
            }
        });
    });
};