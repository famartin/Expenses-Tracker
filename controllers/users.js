const db = require('../db.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const passport = require('passport');
const expressValidator = require('express-validator');

/** Check the Sign Up Form Fields **/

var checkFormFields = function(req){
	req.checkBody('username', 'Username field can not be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 5-15 characters long.').len(5, 15);
}

/** Login GET Route **/

router.get('/login', function(req, res){
	res.render('login');
});

/** Login POST Route **/

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

/** SignUp GET Route **/

router.get('/signup', function(req, res){
	res.render('signup');
});

/** SignUp POST Route **/

router.post('/signup', function(req, res, next){
	checkFormFields(req);

	var errors = req.validationErrors();

	if (errors){
		console.log(errors);
	}
	else{
		var hash = bcrypt.hashSync(req.body.password, salt);
		var user = new db.User({
			username: req.body.username,
			password: hash
		});

		user.save(function(err){
			if (err)
				throw err;
			else{
				req.login(user, function(err){
					if (err)
						console.log(err);
				});
				res.redirect('/');
			}
		});
	}
});

passport.serializeUser(function(id, done){
	done(null, id);
});

passport.deserializeUser(function(id, done){
	db.User.findById(id, function(err, user){
		done(err, id);
	});
});

module.exports = router;
