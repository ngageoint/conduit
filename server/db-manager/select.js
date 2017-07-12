
var query = undefined;
const tools = require('./db-tools.js');

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    fullArticle: function(id, callback) {
        
        var promises = []; //h*ck

        var baseArticle = function(id) {
            return new Promise(function(resolve, reject) {
                module.exports.baseArticle(id, function(res) {
                    if(res)
                        resolve(res);
                    else
                        reject();
                    return Promise.resolve(res); 
                });
            });
        };
        promises.push(baseArticle(id));

        var booksByArticle = function(id) {
            return new Promise(function(resolve, reject) {
                module.exports.booksByArticle(id, function(res) {
                    if(res)
                        resolve(res);
                    else
                        reject();
                    return Promise.resolve(res); 
                });
            });
        };
        promises.push(booksByArticle(id));

        var imagesByArticle = function(id) {
            return new Promise(function(resolve, reject) {
                module.exports.imagesByArticle(id, function(res) {
                    if(res)
                        resolve(res);
                    else
                        reject();
                    return Promise.resolve(res); 
                });
            });
        };
        promises.push(imagesByArticle(id));

        var commentsByArticle = function(id) {
            return new Promise(function(resolve, reject) {
                module.exports.commentsByArticle(id, function(res) {
                    if(res)
                        resolve(res);
                    else
                        reject();
                    return Promise.resolve(res); 
                });
            });
        };
        promises.push(commentsByArticle(id));

        var tagsByArticle = function(id) {
            return new Promise(function(resolve, reject) {
                module.exports.tagsByArticle(id, function(res) {
                    if(res)
                        resolve(res);
                    else
                        reject();
                    return Promise.resolve(res); 
                });
            });
        };
        promises.push(tagsByArticle(id));

        return Promise.all(promises).then(function(res) {
			callback(res);
		});			
    },
    baseArticle: function(id, callback)
    {
        const query = {
            text: tools.readQueryFile('./server/db-manager/queries/SELECT_FULL_ARTICLE.sql'),
            values: [id],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            if(res.rows[0])
                callback(res.rows[0]);
            else
                callback('undefined');
        });
    },
    booksByArticle: function(id, callback) {
        const query = {
            text: tools.readQueryFile('./server/db-manager/queries/SELECT_BOOKS_BY_ARTICLE.sql'),
            values: [id],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            if(res && res.rows)
            {
                var books = [];
                for(var i = 0; i < res.rows.length; i++)
                    books.push(res.rows[i])
                callback(books);
            }
            else
                callback('undefined');
        });
    },
    imagesByArticle: function(id, callback) {
        const query = {
            text: tools.readQueryFile('./server/db-manager/queries/SELECT_IMAGES_BY_ARTICLE.sql'),
            values: [id],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            if(res && res.rows)
            {
                var images = [];
                for(var i = 0; i < res.rows.length; i++)
                    images.push(res.rows[i]['uri']);
                callback(images);
            }
            else
                callback('undefined');
        });
    },
    commentsByArticle: function(id, callback) {
        const query = {
            text: tools.readQueryFile('./server/db-manager/queries/SELECT_COMMENTS_BY_ARTICLE.sql'),
            values: [id],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            if(res && res.rows)
            {
                var comments = [];
                for(var i = 0; i < res.rows.length; i++)
                    comments.push(res.rows[i])
                callback(comments);
            }
            else
                callback('undefined');
        });
    },
    tagsByArticle: function(id, callback) {
        const query = {
            text: tools.readQueryFile('./server/db-manager/queries/SELECT_TAGS_BY_ARTICLE.sql'),
            values: [id],
        }
        this.query(query, function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            if(res && res.rows)
            {
                var tags = [];
                for(var i = 0; i < res.rows.length; i++)
                    tags.push(res.rows[i]['name']);
                callback(tags);
            }
            else
                callback('undefined');
        });
    },
    imageById: function() {
        this.query(tools.readQueryFile('./server/db-manager/queries/SELECT_IMAGE.sql'), [id], function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            for(var i = 0; i < res.rows.length; i++)
                console.log('row ' + i + ':', res.rows[i]);
        });
    }
}
