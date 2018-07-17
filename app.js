const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 3000;
const db = require('./db.js');
const expenses = require('./controllers/expenses.js');
const deposits = require('./controllers/deposits.js');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', expenses, deposits);

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

app.get('/', function(req, res){
	//console.log('you are home');
	db.Balance.find(function(err, balance){
		if (err) throw err;
		if (!isEmpty(balance)){
			//console.log(balance);
			res.render('home', {balance: balance});
		}
		else
			res.render('addBalance');
	});
});

app.post('/', function(req, res){
	//console.log(req.body);
	var balance = new db.Balance({
		total: req.body.balance
	});

	balance.save(function(err){
		if(err) throw (err);
		res.redirect('/');
	});
});

http.listen(port, function(){
	console.log(`Listening on port ${port}`);
});
