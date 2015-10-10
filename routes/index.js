var express = require('express');
var router = express.Router();
var passport = require('passport');
var connect = require('../models')().connection

/* GET home page. */


router.get('/', function (req, res) {
	// console.log(connection);
	var a = connect();
	a.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
 if (err) throw err;

 console.log('The solution is: ', rows[0].solution);
});
	res.send({"yo":"yoyo"});
    // res.render('index', { user : req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
