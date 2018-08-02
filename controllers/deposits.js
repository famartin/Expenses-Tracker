const express = require('express');
const router = express.Router();
const db = require('../db.js');

/** Enter Initial Balance GET Route **/

router.get('/add-balance', authenticationMiddleware(), function(req, res){
	res.render('addBalance');
});

/** Enter Initial Balance POST Route **/

router.post('/add-balance', function(req, res){
	var balance = new db.Balance({
		total: req.body.balance,
		user: req.session.passport.user.username
	});

	balance.save(function(err){
		if (err)
			throw (err);
		res.redirect('/');
	});
});

/** Deposit POST Route **/

router.post('/deposit', function(req, res){
	var deposit = new db.Deposit({
		amount: req.body.amount,
		description: req.body.description,
		username: req.session.passport.user.username
	});

	deposit.save(function(err){
		if (err) throw err;
	});

	db.Balance.findOneAndUpdate({user: req.session.passport.user.username}, {
		$inc: {total: req.body.amount}
		}, function(err, balance){
			if (err) throw err;
			res.redirect('/');
	});
});

/** Cancel Deposit GET Route **/

router.get('/cancel-deposit/:id', function(req, res){
	db.Deposit.findOneAndDelete({_id: req.params.id}, function(err, deposit){
		if (err) throw err;

		db.Balance.findOneAndUpdate({user: deposit.username}, {
			$inc: {total: (deposit.amount * -1)}
		}, function(err, balance){
				if (err) throw err;
				res.redirect('/');			
		});
	});
});

/** List Deposits GET Route **/

router.get('/list-deposits', authenticationMiddleware(), function(req, res){
	db.Deposit.find({username: req.session.passport.user.username}, function(err, deposits){
		if (err) throw err;

		var sum = 0;
		for (var i = 0; i < deposits.length; i++){
			sum += deposits[i].amount;
		}
		res.render('list-deposits', {deposits: deposits.reverse(), sum: sum})
	});
});

/** Check to see if User is logged in **/

function authenticationMiddleware() {
	return (req, res, next) => {
		if (req.isAuthenticated())
			return next();
		res.redirect('/login');
	}
}

module.exports = router;
