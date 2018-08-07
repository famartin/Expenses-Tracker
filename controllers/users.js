const db = require('../db.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const passport = require('passport');
const expressValidator = require('express-validator');

/** Check the Sign Up Form Fields **/

var checkFormFields = function(req) {
	req.checkBody('username', 'Username field can not be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 5-15 characters long.').len(5, 15);
	req.checkBody('password', 'Password must be between 6-50 characters long.').len(6, 50);
	req.checkBody('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
}

/** Login GET Route **/

router.get('/login', function(req, res) {
	res.render('login');
});

/** Login POST Route **/

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

/** Logout GET Route **/

router.get('/logout', function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

/** SignUp GET Route **/

router.get('/signup', function(req, res) {
	res.render('signup');
});

/** SignUp POST Route **/

router.post('/signup', function(req, res, next) {
	checkFormFields(req);

	var errors = req.validationErrors();

	if (errors){
		res.render('signup', {errors: errors});
	}
	else{
		var hash = bcrypt.hashSync(req.body.password, salt);
		var user = new db.User({
			username: req.body.username,
			password: hash
		});

		user.save(function(err){
			if (err)
				res.render('signup', {uniqueErrors: err});
			else{
				req.login(user, function(err) {
					if (err)
						console.log(err);
				});
				res.redirect('/');
			}
		});
	}
});

/** Check to see if a user is signed in **/

function authenticationMiddleware() {
	return (req, res, next) => {
		if (req.isAuthenticated())
			return (next);
		res.redirect('/login');
	}
}

passport.serializeUser(function(id, done) {
	done(null, id);
});

passport.deserializeUser(function(id, done) {
	db.User.findById(id, function(err, user) {
		done(err, id);
	});
});

module.exports = router;
