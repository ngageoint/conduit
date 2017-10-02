var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const insert = require(path.join(__dirname, '..','insert','insert.js'));

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    articleStatus: function(articleId, userId, teamId, isRead) {
        return insert.articleStatus(articleId, userId, teamId, isRead);
    }
};