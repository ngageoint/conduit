const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const db = require('./server/db-manager/db-manager.js');

/*app.use('/public',express.static(path.join(__dirname, '/public')));*/
app.use('/packages', express.static(path.join(__dirname, '/packages')));
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));
app.use('/resources', express.static(path.join(__dirname, '/resources')));
app.use('/styles', express.static(path.join(__dirname, '/styles')));
app.use('/templates', express.static(path.join(__dirname, '/templates')));
app.use('/data', express.static(path.join(__dirname, '/data')));

db.create.tables(function() {
  console.log("attempted to create tables");
})

/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, './', '', 'index.html'));
});

app.get('/articleById', function(req, res, next) {
  db.select.fullArticle(req.query.id, function(article) {
    console.log("rest query");
    console.log(article);
    res.json(article);
  });
})

console.log("listening on " + port);

app.listen(port);