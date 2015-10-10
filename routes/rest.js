var express = require('express');
var router = express.Router();
var passport = require('passport');
var connect = require('../models')().connection

/* GET home page. */


// router.get('/', function (req, res) {
// 	// console.log(connection);
// 	var a = connect();
// 	a.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//  if (err) throw err;

//  console.log('The solution is: ', rows[0].solution);
// });
// 	res.send({"yo":"yoyo"});
//     // res.render('index', { user : req.user });
// });

router.get('/getCurrentUser',ensureAPIAuthenticated, function(req, res) {
	 res.json({
	 		type: true,
	 		data: req.user
	 	});
});

function ensureAPIAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
	// res.json({
	// 	type: false,
	// 	MESSAGE: "NOT AUTHENTICATED"
	// });
	res.redirect('/');
}
module.exports = router;