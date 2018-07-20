const express = require('express');
const router = express.Router();
const db = require('../db.js');

/** Add Expense POST Route **/

router.post('/add-expense', function(req, res){
	var expense = new db.Expense({
		name: req.body.name,
		amount: req.body.amount,
		category: req.body.category,
		balanceId: req.body.balanceId
	});

	expense.save(function(err){
		if (err) throw err;
	});

	db.Balance.findOneAndUpdate({ _id: req.body.balanceId}, {
		$inc: {total: (req.body.amount * -1)}
		}, function(err, balance){
			if (err) throw err;
			res.redirect('/');
		}
	);
});

/** Cancel Expense GET Route **/

router.get('/cancel-expense/:id', function(req, res){
	db.Expense.findOneAndDelete({_id: req.params.id}, function(err, expense){
		if (err) throw err;

		db.Balance.findOneAndUpdate({_id: expense.balanceId}, {
			$inc: {total: expense.amount}
		}, function(err, balance){
				if (err) throw err;
				res.redirect('/');
		});
	});
});

/** List Expenses GET Route **/

router.get('/list-expenses', function(req, res){
	db.Expense.find(function(err, expenses){
		if (err) throw err;
		var sum = 0;
		for(var i = 0; i < expenses.length; i++){
			sum += expenses[i].amount;
		}
		res.render('list-expenses', {expenses: expenses.reverse(), total: sum});
	});
});

/** List Expenses by Category GET Route **/

router.get('/list-expenses/:category', function(req, res){
	db.Expense.find({category: req.params.category},function(err, expenses){
		if (err) throw err;
		var sum = 0;
		for(var i = 0; i < expenses.length; i++){
			sum += expenses[i].amount;
		}
		res.render('list-expenses', {expenses: expenses.reverse(), total: sum});
	});
});

module.exports = router;
