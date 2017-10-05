const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const hash = require('object-hash');

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

app.post('/hash', function(req, res, next) {
	
	var article = req.body.article;

	if(article.title && article.text && article.images && article.source) {
		res.status(200);
		console.log(hash(article));
		res.json({"hash": hash(article)})
	} else {
		res.status(401);
		res.send('Missing hashable fields. title, text, images, and source are required');
		return;
	}
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

app.post('/userInfo', function(req, res, next) {
	
	article = req.body.article

	if(!article)
	{
		res.status(400);
		res.send('Article required');
		return;
	} else {
		res.status(200);
		res.json(users[AUTH_CODE].info);
	}
})

/*=================
   SELECT Endpoint 
 ==================*/
app.get('/select/articleFull', function(req, res, next) {
	if(!req.query.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. articleId required, userId optional');
		return;
	}
	db.select.articleFull(req.query.articleId, req.query.userId).then(function(article) {
		console.log(article);
		res.status(200);
    	res.json(article);
  	});
});

app.get('/select/articlesByUserFromDate', function(req, res, next) {
	if(!req.query.userId || !req.query.date) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. userId and date required');
		return;
	}
	db.select.articlesByUserFromDate(req.query.userId, req.query.date).then(function(article) {
		console.log(article);
		res.status(200);
    	res.json(article);
  	});
});

app.get('/select/imagesByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.imagesByArticle(req.query.id).then(function(images) {
		console.log(images);
		res.status(200);
    	res.json(images);
  	});
});

app.get('/select/booksByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
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

app.get('/select/booksByTeam', function(req, res, next) {
	if(!req.query.teamId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.booksByTeam(req.query.teamId).then(function(books) {
		console.log(books);
		res.status(200);
    	res.json(books);
  	});
});

app.get('/select/commentsByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
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

app.get('/select/mostRecentArticleEdit', function(req, res, next) {
	if(!req.query.articleId || !req.query.userId || !req.query.teamId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. articleId, userId, teamId required.');
		return;
	}
	db.select.mostRecentArticleEdit(req.query.articleId, req.query.userId, req.query.teamId).then(function(edit) {
		console.log(edit);
		res.status(200);
    	res.json(edit);
  	});
});

app.get('/select/tagsByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
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

app.get('/select/articleStatusByIds', function(req, res, next) {
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

app.get('/select/articleBase', function(req, res, next) {
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

/*=================
   INSRET Endpoint 
 ==================*/
 
 app.post('/insert/articleBase', function(req, res, next) {
	if(!req.body.article) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. article is required');
		return;
	}
	db.insert.articleBase(req.body.article).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/insert/articleEdit', function(req, res, next) {
	if(!req.body.articleId || !req.body.userId || !req.body.teamId || !req.body.title || !req.body.text) {
		console.log('Missing params');
		console.log(req.body);
		res.status(400);
		res.send('Missing parameters. articleId, userId, teamId, and isRead are required');
		return;
	}
	db.insert.articleEdit(req.body.articleId, req.body.userId, req.body.teamId, req.body.title, req.body.text).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/insert/articleStatus', function(req, res, next) {
	if(!req.body.articleId || !req.body.userId || !req.body.teamId || (typeof req.body.isRead === "undefined")) {
		console.log('Missing params');
		console.log(req.body);
		res.status(400);
		res.send('Missing parameters. articleId, userId, teamId, and isRead are required');
		return;
	}
	db.insert.articleStatus(req.body.articleId, req.body.userId, req.body.teamId, req.body.isRead).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});
 
 app.post('/insert/book', function(req, res, next) {
	if(!req.body.name) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. name is required, teamId is optional. NOTE: teamId is expected to be required in future versions');
		return;
	}
	db.insert.book(req.body.name, req.body.teamId).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/insert/bookStatus', function(req, res, next) {
	if(!req.body.bookId || !req.body.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. bookId and articleId are required');
		return;
	}
	db.insert.bookStatus(req.body.bookId, req.body.articleId).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/insert/comment', function(req, res, next) {
	console.log(req.body);
	console.log((!req.body.text && !req.body.comment.text))
	if(	!req.body.articleId || !req.body.userId || !req.body.teamId || 
		(!req.body.date && !req.body.comment.date) || 
		(!req.body.text && !req.body.comment.text)) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, userId, teamId, date, and text are required, or a comment object is required');
			return;
	}
	db.insert.comment(req.body.articleId, req.body.userId, req.body.teamId, req.body.comment, req.body.date, req.body.text).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

//TODO: add sopport for image arrays
app.post('/insert/image', function(req, res, next) {
	if(!req.body.uri || !req.body.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. uri and articleId are required');
		return;
	}
	db.insert.image(req.body.uri, req.body.articleId).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

//TODO: add support for tag arrays
app.post('/insert/tag', function(req, res, next) {
	if(!req.body.name || !req.body.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. name and articleId are required');
		return;
	}
	db.insert.tag(req.body.name, req.body.articleId).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/insert/team', function(req, res, next) {
	if(!req.body.name) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. name is required');
		return;
	}
	db.insert.team(req.body.name).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/insert/user', function(req, res, next) {
	if(!req.body.firstName || !req.body.lastName && !req.body.prefName || !req.body.teamId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. firstName, lastName, prefName, and teamId are required. id is optional');
		return;
	}
	if(req.body.id) {
		db.insert.userWithId(req.body.id, req.body.firstName, req.body.lastName, req.body.prefName, req.body.teamId).then(function(result) {
			console.log(result);
			res.status(200);
			res.json(result);
		});
	} else {
		db.insert.userNoId(req.body.firstName, req.body.lastName, req.body.prefName, req.body.teamId).then(function(result) {
			console.log(result);
			res.status(200);
			res.json(result);
		});
	}
});

/*=================
   UPDATE Endpoint 
 ==================*/

 app.post('/update/articleBase', function(req, res, next) {
	if(!req.body.article) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. article is required');
		return;
	}
	db.update.articleBase(req.body.article).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

app.post('/update/articleStatus', function(req, res, next) {
	if(!req.body.articleId || !req.body.userId || !req.body.teamId || (typeof req.body.isRead === "undefined")) {
		console.log('Missing params');
		console.log(req.body);
		res.status(400);
		res.send('Missing parameters. articleId, userId, teamId, and isRead are required');
		return;
	}
	db.update.articleStatus(req.body.articleId, req.body.userId, req.body.teamId, req.body.isRead).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

/*=================
   DELETE Endpoint 
 ==================*/

app.post('/delete/bookStatus', function(req, res, next) {
	if(!req.body.bookId || !req.body.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. bookId and articleId are required');
		return;
	}
	console.log(req.body.bookId);
	console.log(req.body.articleId);
	console.log(req.body);
	db.delete.bookStatus(req.body.bookId, req.body.articleId).then(function(result) {
		console.log(result);
		res.status(200);
    	res.json(result);
  	});
});

console.log("listening on " + port);

app.listen(port);