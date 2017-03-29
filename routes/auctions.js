var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/*
FEATURES
-create new auction
-get list of current auctions
-get more info on specific auction
-bid on auction
*/

var credentials = {
  host     : '192.185.16.74',
  user     : 'dawngard_auction',
  password : 'leKctDo7czJn',
  database : 'dawngard_auction'

};
function sql(query, callback)
{
//init connection
var connection = mysql.createConnection(credentials);
connection.connect();
connection.query(query, callback);
connection.end();
}

router.get('/', function(req, res) {
	res.render('auctions');
});

router.get('/auction', function(req, res) {
	res.render('auctionDetails', {});
});
//get info about an auction
router.get('/json', function(req, res) {
	if (req.query.id && req.query.id.length >= 1)
		{
		query = "SELECT * FROM auctions WHERE startTimestamp <= " ;
		sql(query, function(errors, rows, fields) {
			if (errors) throw errors;
			else if (rows.length == 0) {}
			//Row Example: {name : 'auction 1', startTimestamp : 1222111, endTimestamp : 1222222, maxBid : 5, }
			res.render('auctions', {'auctions' : rows});
		});
		}
	else
		{
		
		}
	
});

router.post('/auction', function(req, res) {
	query = "SELECT * FROM auctions WHERE startTimestamp <= " ;
	sql(query, function(errors, rows, fields) {
	if (errors) throw errors;
	else if (rows.length == 0) {}
	//Row Example: {name : 'auction 1', startTimestamp : 1222111, endTimestamp : 1222222, }
	res.render('auctions', {'auctions' : rows});
	});
	
});
module.exports =  router;