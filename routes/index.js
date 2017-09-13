var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/comments';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { success: req.session.success, errors: req.session.errors, message: 'Registration confirmed' });
});

router.post('/register', function (req, res, next) {

  var data = {
    username: req.body.usernameR,
    password: req.body.passwordR
  };

    req.check('usernameR', 'Fill out username').notEmpty();
    req.check('passwordR', 'Invalid password').notEmpty().equals(req.body.confirmPassword);

    var errors = req.validationErrors();

    if(errors){
      req.session.errors = errors;
      req.session.success = false;
      res.redirect('/');
    }
    else{
      mongo.connect(url, function (err, db) {
         assert.equal(null, err);
         db.collection('users').insertOne(data, function (err, result) {
             assert.equal(null, err);
             db.close();
             req.session.success = true;
             res.redirect('/');
         });
      });
    }
});

router.post('/login', function (req, res, next) {
   var username = req.body.username;
   var password = req.body.password;

   mongo.connect(url, function (err, db) {
      assert.equal(null, err);
      db.collection('users').findOne({"username": username, "password": password}, function (err, user) {
          if(err){
              res.redirect('/');
          }
          else if(user === null){
              res.redirect('/');
          }
          else{
              req.session.user = user;
              res.redirect('/missions');
          }
      });
   });
});

module.exports = router;
