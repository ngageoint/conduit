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

app.get('/articleById', function(req, res, next) {
	db.select.fullArticle(req.query.id, function(article) {
		console.log("rest query");
    	console.log(article);
    	res.json(article);
  	});
})



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