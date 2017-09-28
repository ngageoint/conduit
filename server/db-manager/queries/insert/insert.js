var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const select = require(path.join(__dirname, '..','select','select.js'));

module.exports = {
    setQueryManager: function(query) {
        module.exports.query = query;
    },
    articleBase: function(article) {
        return new Promise(function(resolve, reject) {
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
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    },
    articleStatus: function(articleId, userId, teamId, isRead) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_STATUS.sql')),
                values: [articleId, userId, teamId, isRead]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    book: function(name, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_BOOK.sql')),
                values: [name, teamId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    bookStatus: function(bookId, articleId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_BOOK_STATUS.sql')),
                values: [bookId, articleId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    //TODO: add support for comment object
    comment: function(articleId, userId, teamId, date, text) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_COMMENT.sql')),
                values: [articleId, userId, date, text, teamId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    image: function(uri, articleId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_IMAGE.sql')),
                values: [uri, articleId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    tag: function(name, articleId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_TAG.sql')),
                values: [articleId, name]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    team: function(name) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_TEAM.sql')),
                values: [name]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    userNoId: function(firstName, lastName, prefName, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_USER_NO_ID.sql')),
                values: [firstName, lastName, prefName, teamId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    userWithId: function(id, firstName, lastName, prefName, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_USER_WITH_ID.sql')),
                values: [id, firstName, lastName, prefName, teamId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            });
        });
    },
    sampleData: function() {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_SAMPLE_DATA.sql'))
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else
                    return resolve(res);
            })
        });
    }
};