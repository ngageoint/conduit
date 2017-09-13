var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    db: function(callback) {

        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'CREATE_CONDUIT_DB.sql')),,
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error creating db', err);
            }
            callback();
        });
    },
    tables: function(callback) {
        
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'CREATE_CONDUIT_TABLES.sql')),,
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error creating db tables', err);
            }
            callback();
        });
    }
};