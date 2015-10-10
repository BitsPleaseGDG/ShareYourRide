var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello')
});
router.get('/add',function(req,res,next){
	var response={'success':false};
	req.query.id;
	var start=req.query.start;
	var end=req.query.end;
	var from=req.query.from;
	var to=req.query.to;
	if(start==undefined || end==undefined||from==undefined||to==undefined){
		res.send(JSON.stringify(response));
	}
	// var query='INSERT INTO `hack`.`travels` (`id`, `user_id`, `start_datetime`, `end_datetime`, `start_from`, `upto`) VALUES (NULL, '1', '2015-10-12 08:13:54', '2015-10-12 10:00:00', 'IIT Kanpur', 'Railway Station')';

	response.success=true;
	res.send(JSON.stringify(response));
});

module.exports = router;
