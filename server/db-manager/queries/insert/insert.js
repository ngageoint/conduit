var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const select = require(path.join(__dirname, '..','select','select.js'));

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    articleBase: function(article, callback) {
        var exists = false;
        select.baseArticle(article.id, function(res) {
            if(res.rows[0])
                return false;
        });

        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_BASE.sql')),
            values: [
                article.date,
                article.id,
                article.link,
                article.selectedImage,
                article.text,
                article.title,
                article.customProperties,
                article.source
            ],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            callback();
        });
    },
    articleStatus: function(articleId, userId, teamId, isRead, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_STATUS.sql')),
            values: [articleId, userId, teamId, isRead]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    book: function(name, teamId, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_BOOK.sql')),
            values: [name, teamId]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    bookStatus: function(bookId, articleId, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_BOOK_STATUS.sql')),
            values: [bookId, articleId]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    comment: function(articleId, userId, teamId, date, text, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_COMMENT.sql')),
            values: [articleId, userId, date, text, teamId]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    image: function(uri, articleId, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_IMAGE.sql')),
            values: [uri, articleId]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    tag: function(name, articleId, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_TAG.sql')),
            values: [articleId, name]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    team: function(name, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_TEAM.sql')),
            values: [name]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    userNoId: function(firstName, lastName, prefName, teamId, callback) {
          
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_USER_NO_ID.sql')),
            values: [firstName, lastName, prefName, teamId]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    userWithId: function(id, firstName, lastName, prefName, teamId, callback) {
        
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_USER_WITH_ID.sql')),
            values: [id, firstName, lastName, prefName, teamId]
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    },
    sampleData: function(callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'INSERT_SAMPLE_DATA.sql'))
        }
        this.query(query, function(err, res) {
            if(err) {
                callback(err);
            }
            else
                callback(res);
        })
    }
};