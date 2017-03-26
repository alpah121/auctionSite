var mysql = require('mysql');
var bcrypt = require('bcryptjs');

/* User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
*/

//init connection
var connection = mysql.createConnection({
  host     : '192.185.16.74',
  user     : 'dawngard_auction',
  password : 'leKctDo7czJn',
  database : 'dawngard_auction'
});
console.log("attempting to connect to remote db"); 
connection.connect();
console.log("connected to remote db");
/* 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
*/
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = "SELECT * FROM accounts WHERE username='" + username + "';";
	connection.query(query, callback);
}

module.exports.getUserById = function(id, callback){
	query = "SELECT * FROM accounts WHERE id='" + id + "';";
	connection.query(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
console.log("ending remote db connection");
connection.end();