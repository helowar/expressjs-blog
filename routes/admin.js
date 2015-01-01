var express = require('express');
var router = express.Router();
var Reply = require('../models/reply');
var Blog = require('../models/blog');
var util = require('../common/util');
var async = require('async');
router.get('/admin', function(req, res) {
    if (!req.session.isMe) {
        res.end();
        return;
    }
    async.series([
        function (callback) {
            Reply.findRecentExecptAdmin(req.session.userInfo.userID, function (doc) {
                callback(null, doc);
            });
        },
        function (callback) {
            Blog.findAll(function (doc) {
                callback(null, doc);
            });
        }
    ], function (err, rs) {
        var map = {};
        for (var i = rs[1].length - 1; i >= 0; i--) {
            map[rs[1][i].articleID] = rs[1][i].title;
        }
        for (var i = rs[0].length - 1; i >= 0; i--) {
            rs[0][i].article = map[rs[0][i].articleID];
            if (rs[0][i].replyWhoNick == '**') {
                rs[0][i].replyWhoNick = '你';
            }
        };
        res.render('admin', {
            title: config.blogName,
            isMe : req.session.isMe,
            reply: rs[0],
            doc: rs[1]
        });
    });

});

module.exports = router;
