var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));

module.exports = {
    setQueryManager: function(query) {
        module.exports.query = query;
    },
    articleBase: function(id) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_BASE.sql')),
                values: [id],
            }

            module.exports.query(query, function(err, res) {            
                if(err) {
                    return reject(err);
                }
                if(res.rows) {
                    return resolve(res.rows[0]);
                }
                else {
                    return reject('No results');
                }
            });
        });
    },
    articleFull: function(articleId, userId) {
        return new Promise(function(resolve, reject) {
            var promises = [];

            promises.push(module.exports.articleBase(articleId));
            promises.push(module.exports.booksByArticle(articleId));
            promises.push(module.exports.imagesByArticle(articleId));
            promises.push(module.exports.commentsByArticle(articleId));
            promises.push(module.exports.tagsByArticle(articleId));
            if(userId) {
                promises.push(module.exports.articleStatusByIds(articleId, userId));
            }

            /*promises in order:
            0:base, 1:books[object], 2:images[string], 3:comments[object], 4:tags[string], 5:status[boolean]
            */
            return Promise.all(promises).then(function(res) {
                var article = res[0];
                article.books = res[1];
                article.images = res[2];
                article.comments = res[3];
                article.tags = res[4];
                if(res[5]) {
                    article.read = res[5];
                }

                return resolve(article);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },
    articleStatusByIds: function(articleId, userId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_STATUS_BY_IDS.sql')),
                values: [articleId, userId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0] && res.rows[0].read) {
                    return resolve(res.rows[0].read);
                } else {
                    return reject('No results');
                }
            });
        });
    },
    booksByArticle: function(id) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_BOOKS_BY_ARTICLE.sql')),
                values: [id],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows)
                {
                    var books = [];
                    for(var i = 0; i < res.rows.length; i++)
                        books.push(res.rows[i])
                    return resolve(books);
                }
                else
                    return reject('No results');
            });
        });
    },
    bookStatusByIds: function(bookId, articleId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_BOOK_STATUS_BY_IDS.sql')),
                values: [bookId, articleId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows) {
                    return resolve(res.rows);
                }
                else
                    return reject('No results');
            });
        });
    },
    imagesByArticle: function(id) {
        return new Promise(function(resolve, reject) {        
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_IMAGES_BY_ARTICLE.sql')),
                values: [id],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows)
                {
                    var images = [];
                    for(var i = 0; i < res.rows.length; i++)
                        images.push(res.rows[i]['uri']);
                    return resolve(images);
                }
                else
                   return reject('No results');
                });
        });
    },
    imagesByUriAndArticleId: function(uri, articleId) {
        return new Promise(function(resolve, reject) {        
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_IMAGES_BY_URI_AND_ARTICLE_ID.sql')),
                values: [uri, articleId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows) {
                    return resolve(res.rows);
                }
                else
                   return reject('No results');
                });
        });
    },
    commentsByArticle: function(id) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_COMMENTS_BY_ARTICLE.sql')),
                values: [id],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows)
                {
                    var comments = [];
                    for(var i = 0; i < res.rows.length; i++)
                        comments.push(res.rows[i])
                    return resolve(comments);
                }
                else
                    return reject('No results');
            });
        });
    },
    tagsByArticle: function(id) {
        
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_TAGS_BY_ARTICLE.sql')),
                values: [id],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows)
                {
                    var tags = [];

                    for(var i = 0; i < res.rows.length; i++)
                        tags.push(res.rows[i]['tag']);
                    return resolve(tags);
                }
                else
                    return reject('No results');
            });
        });
    },
    tagsByNameAndArticleId: function(name, articleId) {
        
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_TAGS_BY_NAME_AND_ARTICLE_ID.sql')),
                values: [name, articleId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows) {
                    return resolve(res.rows);
                }
                else
                    return reject('No results');
            });
        });
    }
}
