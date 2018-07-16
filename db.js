const mongoose = require('mongoose');
const key = require('./keys.js');

mongoose.connect("mongodb://" + key.username + ":" + key.password + "@ds139331.mlab.com:39331/expense-tracker", {
	useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(){
	console.log('Database is connected!');
});

module.exports = {
	db
}
