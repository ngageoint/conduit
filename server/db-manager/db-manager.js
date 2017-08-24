//Setup postgres
const pg = require('pg');
const select = require('./queries/select/select.js');
const insert = require('./queries/insert/insert.js');

try {const dotenv = require('dotenv'); dotenv.load()}catch(e){}

  var dbConfig = {
    user: process.env.CONDUIT_DB_USER,
    database: process.env.CONDUIT_DB_NAME, //env var: PGDATABASE
    password: process.env.CONDUIT_DB_PWD, //its a test environment stop judging me
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

  const pool = new pg.Pool(dbConfig);
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err/stack);
  });

 var queryManager = function (text, values, callback) {
    return pool.query(text, values, callback);
  };

var connect = function (callback) {
  return pool.connect(callback);
};

select.setQueryManager(queryManager);
insert.setQueryManager(queryManager);
/*select.fullArticle('1', function(article) {
    console.log(article);
});*/

insert.baseArticle(
    {'date':new Date(),'id':3,'link':'www.google.com','selectedImage':3,'title':'Sample text','title':'Article Three','customProperties':{}},
    function() {
        select.baseArticle('3', function(article) {
            console.log(article);
        });
    }
);

/*
pool.query('SELECT * FROM "conduit-db"."ARTICLES"', [], function(err, res) {
   if(err) {
    return console.error('error running query', err);
  }
  for(var i = 0; i < res.rows.length; i++)
    console.log('row ' + i + ':', res.rows[i]);
});*/