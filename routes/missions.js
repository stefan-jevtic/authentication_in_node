var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/comments';

router.get('/', function (req, res, next) {
    if(req.session.user){
        var arrayOfMissions = [];
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            var cursor = db.collection('missions').find();
            cursor.forEach(function (doc, err) {
                assert.equal(null, err);
                arrayOfMissions.push(doc);
            }, function () {
                db.close();
                res.render('missions', {session: req.session.user, items: arrayOfMissions});
            });
        });
    }
    else{
        res.redirect('/');
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;