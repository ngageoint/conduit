////////////////
////REQUIRES////
////////////////
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const session = require('express-session');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const hash = require('object-hash');

const db = require('./server/db-manager/db-manager.js');
const sso = require('./server/sso/sso.js');
const moe = require('./server/export/export.js'); //Microsoft Office Export, MOE; export is a reserved word
const rate = require('./server/tools/rate.profiles.js');

const ArticleReader = require('./server/article-reader/article-reader.js');
const SourceService = require('./server/tools/sources.service.server.js');

////////////////
////ARTICLES////
////////////////
ArticleReader.readSource(SourceService.sources[1]).then(function(res) {
	db.insert.articleFull(res);
	//db.insert.articleBase(res);
});

////////////////
////ENV VARS////
////////////////
//Load local environment variable file (.env)
try {
    const dotenv = require('dotenv');
    dotenv.load();
}catch(e){}

//Detect environment
var environment = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : process.env;
if(process.env.VCAP_SERVICES) {
	//todo pull pcf secret
}

var authEnabled = (process.env.VCAP_APPLICATION || process.env);
authEnabled = false;

app.use(express.static('public'));
app.use('/packages', express.static(path.join(__dirname, '/packages')));
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));
app.use('/resources', express.static(path.join(__dirname, '/resources')));
app.use('/styles', express.static(path.join(__dirname, '/styles')));
app.use('/templates', express.static(path.join(__dirname, '/templates')));
app.use('/data', express.static(path.join(__dirname, '/data')));

///////////////
////SESSION////
///////////////
app.use(session({
	store: new (require('connect-pg-simple')(session))({
		pool: db.pool,
		schemaName: 'conduit_db'
	}),
	secret: environment.session_secret,
	resave: false,
	name: 'conduit',
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: false,//environment.secure_cookies ? environment.secure_cookies : true, //Pull from environment or default to true
		maxAge: 7 * 24 * 60 * 60 * 1000,
		sameSite: true
	}
}));

app.use(sso.authorizeSession);

var users = {};

/* GET home page. */
app.get('/', rate.restricted, function(req, res, next) {

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
			//TODO set cookie 
			sso.getUserInfo(auth.tokens.access_token).then(function(user) {
				users[req.query.code] = user;
				res.sendFile(path.join(__dirname, './', '', 'index.html'));
			});
		}).catch(function(res) {
			res.status(403);
			res.send("Access denied.");
		});
	}
});

app.get('/unsupported', rate.immediate, function(req, res, next) {
	res.sendFile(path.join(__dirname, './', 'public', 'html', 'unsupported.html'));
});

app.get('/logoff', rate.immediate, function(req, res, next) {
	req.session.destroy();
	res.sendFile(path.join(__dirname, './', 'public', 'html', 'logoff.html'));
});

app.post('/hash', rate.frontloaded, function(req, res, next) {
	var article = req.body.article;
	
	if(article.title && article.text && article.images && article.source) {
		res.status(200);
		res.json({"hash": hash(article)})
	} else {
		res.status(401);
		res.send('Missing hashable fields. title, text, images, and source are required');
		return;
	}
});

app.post('/export', rate.immediateRestricted, function(req, res, next) {
		var article = req.body.article;

		if(article.title && article.text && article.date && req.body.tpltId) {
			res.status(200);
			moe.generateWordDoc(article, req.body.tpltId).then(function(filename) {
				res.send(filename);
			});
		} else {
			res.status(401);
			res.send('Missing export fields. tpltId, title, text, date, and images are required');
			return;
		}
});

app.post('/exportZip', rate.immediateRestricted, function(req, res, next) {
	if(req.body.articles && req.body.tpltId) {
		res.status(200);
		moe.generateZip(req.body.articles, req.body.tpltId).then(function(filename) {
			res.send(filename);
		});
	} else {
		res.status(401);
		res.send('Missing export fields. articles and tpltId are required');
		return;
	}
});

app.get('/download', rate.immediateRestricted, function(req, res, next) {
	var fileName = req.query.fileName;

	var fileName = req.query.fileName;

	if(fileName) {
		res.status(200);
		var filePath = path.resolve(__dirname, 'server', 'export', 'temp', fileName)
		res.download(filePath, fileName, function(err) {
			if(err) {
				console.log(err);
			} else {
				moe.deleteTemporaryFiles(filePath);
			}
		});
	} else {
		res.status(401);
		res.send('Missing fileName');
		return;
	}
});

app.get('/userInfo', rate.frontloadedRestricted, function(req, res, next) {
	
	if(req.query.id) {
		db.select.userById(req.query.id).then(function(user) {
			res.status(200);
			res.json(user);
		});
	}

	return;

	AUTH_CODE = req.query.code;
	if(!AUTH_CODE)
	{
		res.status(400);
		res.send('Authorization code required');
		return;

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
	}
})

/*=================
   SELECT Endpoint 
 ==================*/

 app.get('/select/allEditsForArticleByTeam', rate.immediateRestricted, function(req, res, next) {
		if(!req.query.articleId || !req.query.teamId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId and teamId required');
			return;
		}
		db.select.allEditsForArticleByTeam(req.query.articleId, req.query.teamId).then(function(edits) {
			res.status(200);
			res.json(edits);
		});
});

/*DEPRECIATED
 app.get('/select/articleFull', function(req, res, next) {
	if(!req.query.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. articleId required, userId and teamId optional');
		return;
	}
	db.select.articleFull(req.query.articleId, req.query.userId, req.query.teamId).then(function(article) {
		res.status(200);
    	res.json(article);
  	});
});*/

app.post('/select/articleOriginal', rate.immediate, function(req, res, next) {
		if(!req.body.article) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. article object required, userId and teamId optional');
			return;
		}
		db.select.articleOriginal(req.body.article, req.body.userId, req.body.teamId).then(function(article) {
			res.status(200);
			res.json(article);
		});
});

/*DEPRECIATED
app.get('/select/articlesByUserFromDate', function(req, res, next) {
	if(!req.query.userId || !req.query.date) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. userId and date required');
		return;
	}
	db.select.articlesByUserFromDate(req.query.userId, req.query.date, req.query.teamId).then(function(article) {
		res.status(200);
    	res.json(article);
  	});
});*/

app.get('/select/attributes', rate.frontloadedRestricted, function(req, res, next) {
		db.select.attributes().then(function(attributes) {
			res.status(200);
			res.json(attributes);
		});	
});

/*DEPRECIATED
app.get('/select/imagesByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.imagesByArticle(req.query.id).then(function(images) {
		res.status(200);
    	res.json(images);
  	});
});*/
/*DEPRECIATED
app.get('/select/booksByArticle', function(req, res, next) {
	if(!req.query.id || !req.query.teamId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id and teamId required.');
		return;
	}
	db.select.booksByArticle(req.query.id, req.query.teamId).then(function(books) {
		res.status(200);
    	res.json(books);
  	});
});*/

app.get('/select/booksByTeam', rate.frontloadedRestricted, function(req, res, next) {
		if(!req.query.teamId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. id required.');
			return;
		}
		db.select.booksByTeam(req.query.teamId).then(function(books) {
			res.status(200);
			res.json(books);
		});
});

app.get('/select/commentsByArticle', rate.frontloaded, function(req, res, next) {
		if(!req.query.id || !req.query.teamId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. id required.');
			return;
		}
		db.select.commentsByArticle(req.query.id, req.query.teamId).then(function(comments) {
			res.status(200);
			res.json(comments);
		});
});

app.post('/select/mostRecentArticleEdit', rate.immediateRestricted, function(req, res, next) {
		if(!req.body.article && (!req.body.articleId || !req.body.teamId)) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, teamId required, or an article object is required.');
			return;
		}
		db.select.mostRecentArticleEdit(req.body.article || req.body.articleId, req.body.teamId).then(function(edit) {
			res.status(200);
			res.json(edit);
		});
});

app.get('/select/editContent', rate.immediate, function(req, res, next) {
		if(!req.query.articleId || !req.query.teamId || !req.query.timestamp) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, teamId, and timestamp required');
			return;
		}
		db.select.editContent(req.query.articleId, req.query.teamId, req.query.timestamp).then(function(edit) {
			res.status(200);
			res.json(edit);
		});
});

/*DEPRECIATED
app.get('/select/tagsByArticle', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.tagsByArticle(req.query.id).then(function(tags) {
		res.status(200);
    	res.json(tags);
  	});
});*/
/*DEPRECIATED
app.get('/select/articleStatusReadByIds', function(req, res, next) {
	if(!req.query.articleId || !req.query.userId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. articleId and userId required.');
		return;
	}
	db.select.articleStatusReadByIds(req.query.articleId, req.query.userId).then(function(status) {
		res.status(200);
    	res.json(status);
  	});
});*/

app.get('/select/articleStatusRemovedByTeam', rate.immediateRestricted, function(req, res, next) {
		if(!req.query.articleId || !req.query.teamId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId and userId required.');
			return;
		}
		db.select.articleStatusRemovedByTeam(req.query.articleId, req.query.teamId).then(function(status) {
			res.status(200);
			res.json(status);
		});
});

/* DEPRECIATED
app.get('/select/articleBase', function(req, res, next) {
	if(!req.query.id) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. id required.');
		return;
	}
	db.select.articleBase(req.query.id).then(function(article) {
		res.status(200);
    	res.json(article);
  	});
});*/

app.get('/select/articleBlock', rate.frontloaded, function(req, res, next) {
		if(!req.query.userId || !req.query.teamId || !req.query.fromDate || !req.query.numArticles) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. userId, teamId, fromDate, and numArticles required.');
			return;
		}
		db.select.articleBlock(req.query.userId, req.query.teamId, req.query.fromDate, req.query.numArticles, req.query.startingId).then(function(articles) {
			res.status(200);
			res.json(articles);
		});	
});

/*=================
   INSRET Endpoint 
 ==================*/
 
 /* DEPRECIATED
 app.post('/insert/articleBase', function(req, res, next) {
	if(!req.body.article) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. article is required');
		return;
	}
	db.insert.articleEdit(req.body.articleId, req.body.userId, req.body.teamId, req.body.title, req.body.text).then(function(result) {
		
		let edit = {
			timestamp: result,
			teamId: req.body.teamId
		}
		
		res.status(200);
    	res.json(result);
  	});
});*/
/*DEPRECIATED
app.post('/insert/articleFull', function(req, res, next) {
	if(!req.body.article || !req.body.userId || !req.body.teamId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. article, userId, and teamId are required');
		return;
	}
	db.insert.articleFull(req.body.article, req.body.userId, req.body.teamId).then(function(result) {
		res.status(200);
    	res.json(result);
  	});
});*/

app.post('/insert/articleEdit', rate.intermittent, function(req, res, next) {
		if(!req.body.articleId || !req.body.userId || !req.body.teamId || !req.body.title || !req.body.text) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, userId, teamId, and isRead are required');
			return;
		}
		db.insert.articleEdit(req.body.articleId, req.body.userId, req.body.teamId, req.body.title, req.body.text).then(function(result) {
			
			let edit = {
				timestamp: result,
				teamId: req.body.teamId
			}
			
			res.status(200);
			res.json(edit);
		});	
});

app.post('/insert/articleStatusRead', rate.intermittent, function(req, res, next) {
		if(!req.body.articleId || !req.body.userId || !req.body.teamId || (typeof req.body.isRead === "undefined")) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, userId, teamId, and isRead are required');
			return;
		}
		db.insert.articleStatusRead(req.body.articleId, req.body.userId, req.body.teamId, req.body.isRead).then(function(result) {
			res.status(200);
			res.json(result);
		});
	
});

app.post('/insert/articleStatusRemoved', rate.intermittent, function(req, res, next) {
		if(!req.body.articleId || !req.body.userId || !req.body.teamId || (typeof req.body.isRemoved === "undefined")) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, userId, teamId, and isRemoved are required');
			return;
		}
		db.insert.articleStatusRemoved(req.body.articleId, req.body.userId, req.body.teamId, req.body.isRemoved).then(function(result) {
			res.status(200);
			res.json(result);
		});	
});
 
 app.post('/insert/book', rate.restricted, function(req, res, next) {
		if(!req.body.name) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. name is required, teamId is optional. NOTE: teamId is expected to be required in future versions');
			return;
		}
		db.insert.book(req.body.name, req.body.teamId).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

app.post('/insert/bookStatus', rate.intermittent, function(req, res, next) {
		if(!req.body.bookId || !req.body.articleId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. bookId and articleId are required');
			return;
		}
		db.insert.bookStatus(req.body.bookId, req.body.articleId, req.body.userId, req.body.teamId).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

app.post('/insert/comment', rate.intermittentRestricted, function(req, res, next) {
		if(	!req.body.articleId || !req.body.userId || !req.body.teamId || 
			(!req.body.date && !req.body.comment.date) || 
			(!req.body.text && !req.body.comment.text)) {
				console.log('Missing params');
				res.status(400);
				res.send('Missing parameters. articleId, userId, teamId, date, and text are required, or a comment object is required');
				return;
		}
		db.insert.comment(req.body.articleId, req.body.comment, req.body.date, req.body.text).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

/*DEPRECIATED
//TODO: add sopport for image arrays
app.post('/insert/image', function(req, res, next) {
	if(!req.body.uri || !req.body.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. uri and articleId are required');
		return;
	}
	db.insert.image(req.body.uri, req.body.articleId).then(function(result) {
		res.status(200);
    	res.json(result);
  	});
});*/

/*DEPRECIATED
//TODO: add support for tag arrays
app.post('/insert/tag', function(req, res, next) {
	if(!req.body.name || !req.body.articleId) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. name and articleId are required');
		return;
	}
	db.insert.tag(req.body.name, req.body.articleId).then(function(result) {
		res.status(200);
    	res.json(result);
  	});
});*/

app.post('/insert/team', rate.restricted, function(req, res, next) {
		if(!req.body.name) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. name is required');
			return;
		}
		db.insert.team(req.body.name).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

app.post('/insert/user', rate.restricted, function(req, res, next) {
		if(!req.body.firstName || !req.body.lastName && !req.body.prefName || !req.body.teamId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. firstName, lastName, prefName, and teamId are required. id is optional');
			return;
		}
		if(req.body.id) {
			db.insert.userWithId(req.body.id, req.body.firstName, req.body.lastName, req.body.prefName, req.body.teamId).then(function(result) {

				res.status(200);
				res.json(result);
			});
		} else {
			db.insert.userNoId(req.body.firstName, req.body.lastName, req.body.prefName, req.body.teamId).then(function(result) {
				res.status(200);
				res.json(result);
			});
		}	
});

/*=================
   UPDATE Endpoint 
 ==================*/

 /*DEPRECIATED
 app.post('/update/articleBase', function(req, res, next) {
	if(!req.body.article) {
		console.log('Missing params');
		res.status(400);
		res.send('Missing parameters. article is required');
		return;
	}
	db.update.articleBase(req.body.article).then(function(result) {
		res.status(200);
    	res.json(result);
  	});
});*/

app.post('/update/articleStatusRead', rate.intermittent, function(req, res, next) {
		if(!req.body.articleId || !req.body.userId || !req.body.teamId || (typeof req.body.isRead === "undefined")) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, userId, teamId, and isRead are required');
			return;
		}
		db.update.articleStatusRead(req.body.articleId, req.body.userId, req.body.teamId, req.body.isRead).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

app.post('/update/articleStatusRemoved', rate.intermittent, function(req, res, next) {
		if(!req.body.articleId || !req.body.userId || !req.body.teamId || (typeof req.body.isRemoved === "undefined")) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. articleId, userId, teamId, and isRemoved are required');
			return;
		}
		db.update.articleStatusRemoved(req.body.articleId, req.body.userId, req.body.teamId, req.body.isRemoved).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

/*=================
   DELETE Endpoint 
 ==================*/

app.post('/delete/bookStatus', rate.intermittent, function(req, res, next) {
		if(!req.body.bookId || !req.body.articleId) {
			console.log('Missing params');
			res.status(400);
			res.send('Missing parameters. bookId and articleId are required');
			return;
		}
		db.delete.bookStatus(req.body.bookId, req.body.articleId, req.body.teamId).then(function(result) {
			res.status(200);
			res.json(result);
		});
});

/*=================
   CREATE Endpoint 
 ==================*/
 /*Removed for security
 app.get('/create/tables', function(req, res, next) {
	db.create.tables(req.query.articleId, req.query.userId, req.query.teamId).then(function(res) {
		res.status(200);
    	res.send(res);
  	}).catch(function(err) {
		res.status(500);
		res.send(err);
	});
});*/

console.log("listening on " + port);

app.listen(port);