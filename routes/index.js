var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log(connection)
  myconnect(res)
  // res.send('hello')

/* GET home page. */

});

function myconnect(res){
	connection.query('SELECT * from users', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('The solution is: ', JSON.stringify(rows[0]));
	  res.send(JSON.stringify(rows))
	});
	// connection.end();
}

module.exports = router;
