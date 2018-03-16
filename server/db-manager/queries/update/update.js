var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const insert = require(path.join(__dirname, '..','insert','insert.js'));

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    articleBase: function(article) { 
        return insert.articleBase(article);
    },
    articleStatusRead: function(articleId, userId, teamId, isRead) {
        return insert.articleStatusRead(articleId, userId, teamId, isRead);
    },
    articleStatusRemoved: function(articleId, userId, teamId, isRemoved) {
        return insert.articleStatusRemoved(articleId, userId, teamId, isRemoved);
    }
};