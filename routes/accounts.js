var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

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

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		//encrypt password
		bcrypt.genSalt(10, function(err, salt) {
	    		bcrypt.hash(password, salt, function(err, hash) {
	        	//hashedPassword = hash;
			//add user to database
			query = "INSERT INTO accounts (name, username, email, password) VALUES ('" + name + "', '" + username + "', '" + email + "', '" + hash + "');";
			sql(query, function (errors, rows, fields) {if (errors) {console.log("there was an error when inserting new account");}});
			
			req.flash('success_msg', 'You are registered and can now login');
			
			res.redirect('/users/login');
	    		});
		});

		
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
	var user;
	sql("SELECT * FROM accounts WHERE username='" + username + "'",
	function(errors, rows, fields) {
		if (rows.length == 0) {done(null, false);}
		bcrypt.compare(password, rows[0].password, function(err, isMatch) {
    		if(err) return done(err);
    		if (isMatch) {console.log("login successful"); done(null, rows[0]);}
		else {console.log("login unsuccessful"); done(null, false);}
		});
   	});
  }));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  user = sql("SELECT * FROM accounts WHERE username='" + username + "'", function(errors, rows, fields) {
	done(errors, rows[0]);
	});
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;