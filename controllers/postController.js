var validation = require('../util/validation');

exports.getAllPosts = function (req, res) {
    var numItemPerPage = req.body.numItemPerPage;
    var currentTotalItem = req.body.currentTotalItem;
    var userId = req.body.userId;

    req.getConnection(function (error, conn) {
        if (!conn) {
            res.status(404).send();
            return;
        }

        conn.query("SELECT a.M_POST_ID, a.M_USER_ID, a.M_CREATED_ON, a.M_CONTENT, a.M_NUM_LIKES, a.M_NUM_COMMENTS, u.RESIDENT_NM FROM tland.M_POST as a LEFT JOIN tland.CM_RESIDENT as u ON (a.M_USER_ID = u.M_USER_ID) GROUP BY a.M_POST_ID ORDER BY M_CREATED_ON DESC LIMIT ?,?",
            [currentTotalItem, numItemPerPage], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err);
                } else {
                    if (rows && rows.length > 0) {
                        var count = 0;
                        var maxLength = rows.length;
                        rows.forEach(data => {
                            conn.query("SELECT M_POST_LIKE_ID FROM tland.M_POST_LIKE WHERE M_POST_ID = ? AND M_USER_ID=?",
                                [data.M_POST_ID, userId], function (err, row) {
                                    count++;
                                    if (!err && row.length > 0) {
                                        data["IS_LIKE"] = 1;
                                    }

                                    if (count == maxLength) {
                                        res.status(200).send(rows);
                                    }
                                });
                        });
                    } else {
                        res.status(200).send(rows);
                    }
                }
            });
    });
};

exports.getMyPosts = function (req, res) {
    var numItemPerPage = req.body.numItemPerPage;
    var currentTotalItem = req.body.currentTotalItem;
    var userId = req.body.userId;

    req.getConnection(function (error, conn) {
        if (!conn) {
            console.log('no conn');
            res.status(404).send();
            return;
        }

        conn.query("SELECT a.M_POST_ID, a.M_USER_ID, a.M_CREATED_ON, a.M_CONTENT, a.M_NUM_LIKES, a.M_NUM_COMMENTS, u.RESIDENT_NM FROM tland.M_POST as a LEFT JOIN tland.CM_RESIDENT as u ON (a.M_USER_ID = u.M_USER_ID) WHERE a.M_USER_ID=? GROUP BY a.M_POST_ID ORDER BY M_CREATED_ON DESC LIMIT ?,?",
            [userId, currentTotalItem, numItemPerPage], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err);
                } else {
                    if (rows && rows.length > 0) {
                        var count = 0;
                        var maxLength = rows.length;
                        rows.forEach(data => {
                            conn.query("SELECT M_POST_LIKE_ID FROM tland.M_POST_LIKE WHERE M_POST_ID = ? AND M_USER_ID=?",
                                [data.M_POST_ID, userId], function (err, row) {
                                    count++;
                                    if (!err && row.length > 0) {
                                        data["IS_LIKE"] = 1;
                                    }

                                    if (count == maxLength) {
                                        res.status(200).send(rows);
                                    }
                                });
                        });
                    } else {
                        res.status(200).send(rows);
                    }
                }
            });
    });
};

exports.like = function (req, res) {
    var postId = req.body.postId;
    var userId = req.body.userId;
    var status = req.body.status;

    req.getConnection(function (error, conn) {
        if (!conn) {
            console.log('no conn');
            res.status(404).send();
            return;
        }

        if (status === 1) {
            // Like
            conn.query("SELECT M_POST_LIKE_ID FROM tland.M_POST_LIKE WHERE M_POST_ID =? AND M_USER_ID=? LIMIT 1",
                [postId, userId], function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(404).send(err);
                        return;
                    }

                    if (res && res.length > 0) {
                        res.status(404).send();
                        return;
                    }

                    // Insert like
                    conn.query("INSERT INTO tland.M_POST_LIKE(M_POST_ID, M_USER_ID, M_CREATED_ON) values(?,?,?)", [postId, userId, (new Date()).getTime()],
                        function (err, rows) {
                            if (err) {
                                console.log(err);
                                res.status(404).send(err);
                                return;
                            }

                            // Update like count
                            conn.query("UPDATE tland.M_POST SET M_NUM_LIKES = M_NUM_LIKES + 1 WHERE M_POST_ID = ?", [postId], function(err,rows) {
                                if (err) {
                                    console.log(err);
                                    res.status(404).send(err);
                                    return;
                                }
                                
                                res.status(200).end();
                            })
                        });
                });
        } else if (status === 0) {
            // UnLike
            conn.query("SELECT M_POST_LIKE_ID FROM tland.M_POST_LIKE WHERE M_POST_ID =? AND M_USER_ID=? LIMIT 1",
                [postId, userId], function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(404).send(err);
                        return;
                    }

                    if (res && res.length < 1) {
                        res.status(404).end();
                        return;
                    }

                    // Remove like
                    conn.query("DELETE FROM tland.M_POST_LIKE WHERE M_POST_ID = ? AND M_USER_ID = ?", [postId, userId, (new Date()).getTime()],
                        function (err, rows) {
                            if (err) {
                                console.log(err);
                                res.status(404).send(err);
                                return;
                            }

                            // Update like count
                            conn.query("UPDATE tland.M_POST SET M_NUM_LIKES = M_NUM_LIKES - 1 WHERE M_POST_ID = ?", [postId], function(err,rows) {
                                if (err) {
                                    console.log(err);
                                    res.status(404).send(err);
                                    return;
                                }

                                res.status(200).end();
                            })
                        });
                });
        }
    });
};

exports.submit = function (req, res) {
    var content = req.body.content;
    var userId = req.body.userId;

    req.getConnection(function (error, conn) {
        if (!conn) {
            console.log('no conn');
            res.status(404).send();
            return;
        }

        // Submit
        var createdOn = (new Date()).getTime();
        conn.query('INSERT INTO tland.M_POST (M_USER_ID, M_CREATED_ON, M_CONTENT) values(?, ?, ?)',
            [userId, createdOn, content], function(err, rows) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err);
                    return;
                }

                res.status(200).send({id: rows.insertId, createdOn: createdOn});
            });
    });
};

exports.getComment = function (req, res) {
    var numItemPerPage = req.body.numItemPerPage;
    var currentTotalItem = req.body.currentTotalItem;
    var postId = req.body.postId;

    req.getConnection(function (error, conn) {
        if (!conn) {
            console.log('no conn');
            res.status(404).send();
            return;
        }

        conn.query("SELECT a.M_POST_COMMENT_ID, a.M_USER_ID, a.M_POST_ID, a.M_COMMENT,  a.M_CREATED_ON, u.RESIDENT_NM  FROM tland.M_POST_COMMENT as a LEFT JOIN tland.CM_RESIDENT as u ON (a.M_USER_ID = u.M_USER_ID)  WHERE a.M_POST_ID=? GROUP BY a.M_POST_COMMENT_ID ORDER BY M_CREATED_ON DESC  LIMIT ?,?",
            [postId, currentTotalItem, numItemPerPage], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err);
                } else {
                    res.status(200).send(rows);
                }
            });
    });
};

exports.submitComment = function (req, res) {
    var content = req.body.content;
    var userId = req.body.userId;
    var postId = req.body.postId;

    req.getConnection(function (error, conn) {
        if (!conn) {
            console.log('no conn');
            res.status(404).send();
            return;
        }

        // Submit
        var createdOn = (new Date()).getTime();
        conn.query('INSERT INTO tland.M_POST_COMMENT (M_USER_ID, M_POST_ID, M_CREATED_ON, M_COMMENT) values(?, ?, ?, ?)',
            [userId, postId, createdOn, content], function(err, rows) {
                if (err) {
                    console.log(err);
                    res.status(404).send(err);
                    return;
                }

                var insertId = rows.insertId;

                conn.query("UPDATE tland.M_POST SET M_NUM_COMMENTS = M_NUM_COMMENTS + 1 WHERE M_POST_ID = ?", 
                    [postId], function(err, rows) {
                        res.status(200).send({id: insertId, createdOn: createdOn});
                    })
            });
    });
};
