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

router.get('/list-expenses/:category*?', function(req, res){
	db.Expense.find(function(err, expenses){
		if (err) throw err;
		var sum = 0;
		for (var i = 0; i < expenses.length; i++){
			sum += expenses[i].amount;
		}
		db.Expense.find({category: 'food'}, function(err, foodExpenses){
			if (err) throw err;
			var foodSum = 0;
			for (var i = 0; i < foodExpenses.length; i++){
				foodSum += foodExpenses[i].amount;
			}
			db.Expense.find({category: 'gas'}, function(err, gasExpenses){
				if (err) throw err;
				var gasSum = 0;
				for (var i = 0; i < gasExpenses.length; i++){
					gasSum += gasExpenses[i].amount;
				}
				db.Expense.find({category: 'bill'}, function(err, billExpenses){
					if (err) throw err;
					var billSum = 0;
					for (var i = 0; i < billExpenses.length; i++){
						billSum += billExpenses[i].amount;
					}
					db.Expense.find({category: 'fun'}, function(err, funExpenses){
						if (err) throw err;
						var funSum = 0;
						for (var i = 0; i < funExpenses.length; i++){
							funSum += funExpenses[i].amount;
						}
						db.Balance.find(function(err, balance){
							if (err) throw err;
							var cats = {
								"food": [foodExpenses, foodSum],
								"gas": [gasExpenses, gasSum],
								"bill": [billExpenses, billSum],
								"fun": [funExpenses, funSum]
							};

							var expenseList = expenses;

							for (var key in cats){
								if (req.params.category == key){
									var expenseList = cats[key][0];
									sum = cats[key][1];
								}
							}
							res.render('list-expenses', {
								expenses: expenseList.reverse(),
								total: sum,
								foodSum: foodSum,
								gasSum: gasSum,
								billSum: billSum,
								funSum: funSum,
								balance: balance
							});	
						});
					});
				});
			});
		});
	});
});

module.exports = router;
