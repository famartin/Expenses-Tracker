const express = require('express');
const router = express.Router();
const db = require('../db.js');

/** Add Expense POST Route **/

router.post('/add-expense', function(req, res){
	var expense = new db.Expense({
		name: req.body.name,
		amount: req.body.amount,
		category: req.body.category
	});

	expense.save(function(err){
		if (err) throw err;
	});
	console.log(req.body.balanceId);
	db.Balance.findOneAndUpdate({ _id: req.body.balanceId}, {
		total: req.body.total - req.body.amount
		}, function(err, balance){
			if (err) throw err;
			if (balance != null){
				res.render('home', {balance: balance});
			}
		}
	);
	
	res.redirect('/');
});

/** List Expenses GET Route **/

router.get('/list-expenses', function(req, res){
	db.Expense.find(function(err, expenses){
		if (err) throw err;
		if (expenses != null){
			res.render('list', {things: expenses})
		}
	});
});

module.exports = router;
