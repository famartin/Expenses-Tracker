const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 3000;
const db = require('./db.js');
const expenses = require('./controllers/expenses.js');
const deposits = require('./controllers/deposits.js');
const users = require('./controllers/users.js');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(expressValidator());

var sessionStore = new MongoStore({mongooseConnection: db.db});

app.use(session({
	secret: 'test',
	resave: false,
	store: sessionStore,
	saveUninitialized: false
}));

/** Passport Initialization **/

app.use(passport.initialize());
app.use(passport.session());

/** Global Variables to use in views **/

app.use(function(req, res, next){
	if (req.isAuthenticated()) {
		res.locals.username = req.session.passport.user.username;
	}
	else {
		res.locals.username = "";
	}
	next();
});

app.use('/', expenses, deposits, users);

/** Passport Local Strategy **/

passport.use(new LocalStrategy(function(username, password, done){
	db.User.findOne({username: username}, function(err, user){
		if (err)
			return done(err);
		if (user == null)
			return done(null, false);
		bcrypt.compare(password, user.password, function(err, response){
			if (response == true)
				return done(null, user);
			else
				return done(null, false);
		});
	});
}));

/** Check to see if the object is empty **/

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return (false);
    }
    return (true);
}

/** Home GET Route **/

app.get('/', function(req, res) {
	if (req.isAuthenticated() == true) {
		db.Balance.find({user: req.session.passport.user.username}, function(err, balance){
			if (err)
				throw err;
			if (!isEmpty(balance)) {
				res.render('home', {balance: balance});
			}
			else
				res.redirect('/add-balance');
		});
	}else{
		res.redirect('/login');
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

/** Listen to the port **/

http.listen(port, function(){
	console.log(`Listening on port ${port}`);
});
