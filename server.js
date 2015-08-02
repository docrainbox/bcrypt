// To test this type in the browser
// localhost:8080/enterText
// Enter some text in the form
// Immediately you will be taken to localhost:8080/compareText
// If you enter the same text as before, you will see true. Otherwise false
// Ram Srinivasan  July 2015
var express = require('express'),
	bcrypt = require('bcrypt'),
	app = express(),
	port = process.env.PORT || 8080,
	morgan = require('morgan'),
	//
	// body-parser contains parser, json and urlencoded
	//
	bdyprsr = require('body-parser');

	//***NOTES***
	//hash = one way encryption. Note that doing twice is gives the same result.
	//hash('asdf') => asdfkadsjflksdfjdslkj
	//hash('asdf') => asdfkadsjflksdfjdslkj

	/*
		In order of worst to best, the following practices are listed.
		Salting is manipulating input string in a predictable way and then hashing.
		A. plain text
		B. encryption
		C. hashing
		D. salt + hashing
	*/

app.use(bdyprsr.json());
app.use(bdyprsr.urlencoded());
app.use((morgan('combined')));

secureStore = "";

//render a form that allows user to enter a string
app.get('/enterText',function(req,res) {
	res.send('<h1>Enter, Re-enter, Compare test</h1><form method="post" action="/enterText"><input name="txt"><button type="submit">Enter</button>');
});

// When the user types something, take it and salt it
// Then hash it. The bcrypt call will finally return
// the hashed version of whatever was typed. 
app.post('/enterText',function(req,res,next) {
	console.log(req.body);
	bcrypt.genSalt(10,function(err,salt) {
		if(err) return next(err);
		bcrypt.hash(req.body.txt,salt,function(err,hash) {
			if(err) return next(err);
			secureStore = hash; //put it in memory to compare with later
			//Take the user to compareText page to see whether he can type the same text
			res.redirect('/compareText');
		});
	});
});

//render a form that allows user to enter a string
app.get('/compareText',function(req,res) {
	res.send('<h1>Compare</h1><form method="post" action="/compareText"><input name="txt"><button type="submit">Enter</button>');
});

//takes something from req.body, and compares it to a stored salted and hashed string in memory
app.post('/compareText',function(req,res,next) {
	bcrypt.compare(req.body.txt,secureStore,function(err,match) {
		res.send(match);
	});
});


app.listen(port,function(err) {
	console.log('listening on %s',port);
});