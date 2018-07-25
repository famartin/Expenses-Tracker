const db = require('../db.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const passport = require('passport');

/** SignUp GET Route **/

router.get('/signup', function(req, res){
	res.render('signup');
});

/** SignUp POST Route **/

router.post('/signup', function(req, res, next){
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
});

module.exports = router;
