var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const select = require(path.join(__dirname, '..','select','select.js'));

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    baseArticle: function(article, callback) {
        var exists = false;
        select.baseArticle(article.id, function(res) {
            if(res.rows[0])
                return false;
        });

        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_BASE_ARTICLE.sql')),
            values: [
                article.date,
                article.id,
                article.link,
                article.selectedImage,
                article.text,
                article.title,
                article.customProperties
            ],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            callback();
        });
    }
};