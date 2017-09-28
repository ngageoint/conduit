const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

const db = require('./server/db-manager/db-manager.js');
const sso = require('./server/sso/sso.js');

//Load local environment variable file (.env)
try {const dotenv = require('dotenv'); dotenv.load()}catch(e){}

var authEnabled = (process.env.VCAP_APPLICATION || process.env);
authEnabled = false;

/*app.use('/public',express.static(path.join(__dirname, '/public')));*/
app.use('/packages', express.static(path.join(__dirname, '/packages')));
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));
app.use('/resources', express.static(path.join(__dirname, '/resources')));
app.use('/styles', express.static(path.join(__dirname, '/styles')));
app.use('/templates', express.static(path.join(__dirname, '/templates')));
app.use('/data', express.static(path.join(__dirname, '/data')));

var users = {}


/* GET home page. */
app.get('/', function(req, res, next) {

	
	if(!authEnabled)
	{
		res.sendFile(path.join(__dirname, './', '', 'index.html'));
		return;
	}

	//Authentication
	//Check for SSO code
	if(!req.query.code)
		res.redirect(sso.REDIRECT_URL());
	else {
		sso.authenticateUser(req.query.code).then(function(auth) {
			sso.getUserInfo(auth.tokens.access_token).then(function(user) {
				users[req.query.code] = user;
				res.sendFile(path.join(__dirname, './', '', 'index.html'));
			})
		}).catch(function(res) {
			res.status(403);
			res.send("Access denied.");
		})
	}
});

app.get('/unsupported', function(req, res, next) {
	res.sendFile(path.join(__dirname, './', 'public', 'html', 'unsupported.html'));
});

app.get('/userInfo', function(req, res, next) {
	AUTH_CODE = req.query.code;

	if(!AUTH_CODE)
	{
		res.status(400);
		res.send('Authorization code required');
		return;
	}
	if(!users[AUTH_CODE]);
	{
		res.status(401);
		res.send('Authorization code not valid.');
		return;
	}
	res.status(200);
	res.json(users[AUTH_CODE].info);
})

app.get('/query/imagesByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('No id');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.imagesByArticle(req.query.id).then(function(images) {
		console.log(images);
		res.status(200);
    	res.json(images);
  	});
	/*db.select.imagesByArticle(req.query.id, function(images) {
		console.log(images);
		res.status(200);
    	res.json(images);
  	});*/
});

app.get('/query/booksByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('No id');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.booksByArticle(req.query.id).then(function(books) {
		console.log(books);
		res.status(200);
    	res.json(books);
  	});
});

app.get('/query/commentsByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('No id');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.commentsByArticle(req.query.id).then(function(comments) {
		console.log(comments);
		res.status(200);
    	res.json(comments);
  	});
});

app.get('/query/tagsByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('No id');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.tagsByArticle(req.query.id).then(function(tags) {
		console.log(tags);
		res.status(200);
    	res.json(tags);
  	});
});

app.get('/query/articleStatusByIds', function(req, res, next) {
	if(!req.query.articleId || !req.query.userId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. articleId and userId required.');
		return;
	}
	db.select.articleStatusByIds(req.query.articleId, req.query.userId).then(function(status) {
		console.log(status);
		res.status(200);
    	res.json(status);
  	});
});

app.get('/query/articleBase', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.articleBase(req.query.id).then(function(article) {
		console.log(article);
		res.status(200);
    	res.json(article);
  	});
});



console.log("listening on " + port);

app.listen(port);


/*Test functions
db.create.tables(function(res) {
	console.log(res);
})

db.insert.sampleData(function(res) {
	console.log(res);
})

*/