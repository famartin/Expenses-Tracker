const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('home');
	console.log('you are home');
});

http.listen(port, function(){
	console.log(`Listening on port ${port}`);
});
