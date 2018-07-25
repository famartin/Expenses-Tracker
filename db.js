const mongoose = require('mongoose');
const key = require('./keys.js');

/** Connect to MongoDB **/

mongoose.connect("mongodb://" + key.username + ":" + key.password + "@ds139331.mlab.com:39331/expense-tracker", {
	useNewUrlParser: true
});

const Schema = mongoose.Schema;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/** Connection Message **/

db.once('open', function(){
	console.log('Database is connected!');
});

/** User Schema **/

var userSchema =	new Schema({
	username:		{type: String, unique: true, required: true},
	password:		{type: String, required: true}
});

/** Balance Schema **/

var balanceSchema =	new Schema({
	total:			{type: Number, required: true}
});

/** Expense Schema **/

var expenseSchema =	new Schema({
	name:			{type: String, required: true},
	date:			{type: Date, default: Date.now},
	amount:			{type: Number, required: true},
	category:		{type: String, required: true},
	balanceId:		{type: String, required: true}
});

/** Deposit Schema **/

var depositSchema =	new Schema({
	date:			{type: Date, default: Date.now},
	amount:			{type: Number, required: true},
	balanceId:		{type: String, required: true},
	description:	{type: String}
});

/** Create the Models **/

var Balance = mongoose.model('Balance', balanceSchema);
var Expense = mongoose.model('Expense', expenseSchema);
var Deposit = mongoose.model('Deposit', depositSchema);

module.exports = {
	db,
	Balance,
	Expense,
	Deposit
}
