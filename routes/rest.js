var express = require('express');
var router = express.Router();
var passport = require('passport');
var connection = require('../models')().connection()

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
router.get('/', function(req, res, next) {
  res.send('hello')
});
router.get('/add',function(req,res,next){
	var response={'success':false};
	var id=req.query.id;
	var start=req.query.start;
	var end=req.query.end;
	var from=req.query.from;
	var to=req.query.to;
	console.log(id)
	if(start==undefined || end==undefined||from==undefined||to==undefined){
		res.send(JSON.stringify(response));
	}
	var query="INSERT INTO `hack`.`travels` (`id`, `user_id`, `start_datetime`, `end_datetime`, `start_from`, `upto`) VALUES (NULL, ?, ?, ?, ?, ?)";
	connection.query(query,[id,start,end,from,to]);

	response.success=true;
	res.send(JSON.stringify(response));
});

router.get('/displayall',ensureAPIAuthenticated,function(req,res,next){
	var travelid=req.query.travelid;
	var query='SELECT * FROM travels WHERE id=? and user_id=?';
	var id=req.user.id;
	var s1,e1;
	connection.query(query,[travelid,id],function(err,rows,fields){
		if(rows.length==0){
			res.send({type:false});
			return;
		}
		s1=rows[0].start_datetime;
		e1=rows[0].end_datetime;
		var start_from=rows[0].start_from;
		var upto=rows[0].upto;
		getFeed(s1,e1,start_from,upto,travelid,res);
	});
});

router.get('/makegroup',ensureAPIAuthenticated,function(req,res,next){
	var capacity=req.query.cap>2?req.query.cap:2;
	var first_travel_id=req.query.fti;
	var second_travel_id=req.query.sti;
	var id=req.user.id;
	if(second_travel_id==first_travel_id){
		res.send({type:false});
		return;
	}
	var query='SELECT * FROM travels WHERE id = ? OR id = ?';
	connection.query(query,[first_travel_id,second_travel_id],function(err,rows){
		if(rows.length!=2){
			res.send({type:false});
			return;
		}else{
			if(rows[0].user_id!=id&&rows[1].user_id!=id){
				res.send({type:false});
				return;
			}
		}
		var grouptime=commonIntervalOfTwo(rows[0].start_datetime,rows[0].end_datetime,rows[1].start_datetime,rows[1].end_datetime);
		if(grouptime==false || rows[0].engaged==1 || rows[1].engaged==1 || !checkDestination(rows[0].start_from,rows[0].upto,rows[1].start_from,rows[1].upto)){
			res.send({type:false});
			console.log('Error')
			return;
		}
		finallymakegroup(res,first_travel_id,second_travel_id,rows[0].start_from,rows[0].upto,grouptime,capacity);
	});
});
router.get('/addtogroup',ensureAPIAuthenticated,function(req,res,next){
	var id=req.user.id;
	var group_id=req.query.group_id;
	var travel_id=req.query.travel_id;
	console.log(id)
	var query="SELECT * FROM `hack`.`travels` WHERE `id` = ? AND `user_id` = ?  AND `engaged` = ?";
	connection.query(query,[travel_id,id,0],function(err,rows){
		if(rows.length < 1){
			res.send({type:false});
			return;
		}
		GroupEmptiness(group_id,function(e){
			if(e>=1){
				insertIntoGroupTravels(group_id,travel_id);
				updateEngagement(travel_id,true);
				res.send({type:true});
			}else{
				res.send({type:false});
				return;
			}
		})
	});
})

function GroupEmptiness(id,callback){
	var query='SELECT COUNT(*) as count FROM `hack`.`group_travels` WHERE `group_id`=?';
	var count;
	connection.query(query,[id],function(err,rows){
		query='SELECT * FROM `hack`.`groups` WHERE id=?';
		connection.query(query,[id],function(err,rowsx){
			if(callback!==undefined){
				callback(rowsx[0].capacity - rows[0].count);
				console.log(rowsx[0].capacity - rows[0].count);
			}
		})
	})
	return count;
}

function finallymakegroup(res,fti,sti,start_from,upto,grouptime,capacity){
	var query='INSERT INTO `hack`.`groups` (`id`,`start_from`,`upto`,`start_datetime`,`end_datetime`,`capacity`) ';
	query+=' VALUES(NULL,?,?,?,?,?)';
	connection.query(query,[start_from,upto,grouptime[0],grouptime[1],capacity],function(err,rows){
		if(err){
			res.send({type:false})
			console.log('Error')
			return;
		}
		var insert_id=rows.insertId;
		insertIntoGroupTravels(insert_id,fti);
		insertIntoGroupTravels(insert_id,sti);
		res.send('success');
	})
}

function insertIntoGroupTravels(group_id,travel_id){
	var query='INSERT INTO `hack`.`group_travels` (`id`,`group_id`,`travel_id`,`created_at`,`updated_at`) ';
	query+=' VALUES(NULL,?,?,?,?)';
	var current_time=new Date().getTime();
	connection.query(query,[group_id,travel_id,current_time,current_time],function(err,rows){
		if(err){
			console.log('Error inserting insertIntoGroupTravels',err);
			return;
		}
		updateEngagement(travel_id,true);
		console.log('successfully inserted into insertIntoGroupTravels\n',rows);
	})
}

function checkDestination(s1,e1,s2,e2){
	return s1.toLowerCase().trim()==s2.toLowerCase().trim() && e1.toLowerCase().trim()==e2.toLowerCase().trim();
}

function updateEngagement(id,v){
	var query='UPDATE `hack`.`travels` SET engaged= ? WHERE id=?';
	var v=(v==true)?true:false;
	connection.query(query,[v,id],function(err, rows){
		if(err){
			console.log('Error updating travels engagement',err);
			return;
		}
		console.log('successfully updated travels engagement');
	});
}

function commonIntervalOfTwo(a,b,c,d){
	if(b < c || d<a ){
		return false;
	}
	var start=Math.max(a,c), end=Math.min(b,d);
	return [start,end];
}

function getFeed(s1,e1,start_from,upto,travelid,res){
	var count=0;
	var tosend={};
	var totalq=2;
	var query='SELECT * FROM travels WHERE (`start_datetime` <= ?) AND (`end_datetime` >= ? ) AND `id` != ?  AND engaged=0 AND `start_from`=? AND `upto`=?';
	connection.query(query,[e1,s1,travelid,start_from,upto],function(err,rows,fields){
		if(err){
			tosend.travels=false;
		}else{
			tosend.travels=rows;
		}
		count++;
		if(count==totalq){
			res.send(tosend);
		}
	});

	var query='SELECT users.id as user_id, users.name as name, groups.id as group_id, groups.capacity as capacity, groups.start_from as start_from, groups.upto as upto';
	query+=' FROM travels';
	query+=' INNER JOIN group_travels ON travels.id = group_travels.travel_id';
	query+=' INNER JOIN users ON travels.user_id=users.id';
	query+=' INNER JOIN groups ON groups.id = group_travels.group_id'
	query+=' WHERE groups.start_from = ? AND groups.upto = ? AND travels.engaged=1 AND (groups.start_datetime <= ? AND groups.end_datetime >=?)';
	connection.query(query,[start_from,upto,e1,s1],function(err,rows){
		if(err){
			console.log(err)
			tosend.groups=query;
		}else{
			tosend.groups=rows;
		}
		count++;
		if(count==totalq){
			res.send(tosend);
		}
	})
}


function ensureAPIAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
	res.json({
		type: false,
		MESSAGE: "NOT AUTHENTICATED"
	});
	// res.redirect('/');
}
module.exports = router;