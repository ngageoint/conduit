//Setup postgres
const pg = require('pg');
const select = require('./queries/select/select.js');
const insert = require('./queries/insert/insert.js');
const create = require('./queries/create/create.js');
const update = require('./queries/update/update.js');
const del = require('./queries/delete/delete.js');

//Load local environment variable file (.env)
try {
    const dotenv = require('dotenv');
    dotenv.load();
} catch(e){}

//Detect environment
var environment = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : process.env;
if(process.env.VCAP_SERVICES)
  environment = environment['crunchy-postgresql-9.5-on-demand'][0].credentials;

var dbConfig = {
  user: environment.db_username || environment.username,
  database: environment.db_name,
  password: environment.password,
  host: environment.db_host,
  port: environment.db_port,
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
create.setQueryManager(queryManager);
update.setQueryManager(queryManager);
del.setQueryManager(queryManager);

module.exports = {
  pool: pool,
  select: select,
  insert: insert,
  create: create,
  update: update,
  delete: del
};