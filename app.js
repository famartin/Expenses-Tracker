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
app.use(express.static(__dirname + '/public'));

app.use('/', expenses, deposits);

/* Check to see if the object is empty */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return (false);
    }
    return (true);
}

/** Home GET Route **/

app.get('/', function(req, res){
	db.Balance.find(function(err, balance){
		if (err) throw err;
		if (!isEmpty(balance)){
			res.render('home', {balance: balance});
		}
		else
			res.render('addBalance');
	});
});

/** Add Initial Balance POST Route **/

app.post('/', function(req, res){
	var balance = new db.Balance({
		total: req.body.balance
	});

	balance.save(function(err){
		if(err) throw (err);
		res.redirect('/');
	});
});

/** Listen to the port **/

http.listen(port, function(){
	console.log(`Listening on port ${port}`);
});
