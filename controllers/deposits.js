const express = require('express');
const router = express.Router();
const db = require('../db.js');

/** Deposit POST Route **/

router.post('/deposit', function(req, res){
	var deposit = new db.Deposit({
		amount: req.body.amount
	});

	deposit.save(function(err){
		if (err) throw err;
	});

	db.Balance.findOneAndUpdate({ _id: req.body.balanceId}, {
		total: (req.body.total - 0) + (req.body.amount - 0)
		}, function(err, balance){
			if (err) throw err;
			res.render("home", {balance: balance});
		}
	);
	
	res.redirect('/');
});

/** List Deposits GET Route **/

router.get('/list-deposits', function(req, res){
	db.Deposit.find(function(err, deposits){
		if (err) throw err;
		if (deposits != null){
			res.render('list-deposits', {deposits: deposits})
		}
	});
});

module.exports = router;
