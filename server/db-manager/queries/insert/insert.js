var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const select = require(path.join(__dirname, '..','select','select.js'));
const DateTools = require(path.join('..', '..', '..', 'tools', 'date.tools.js'));

module.exports = {
    setQueryManager: function(query) {
        module.exports.query = query;
    },
    articleFull: function(article, userId, teamId) {
        return new Promise(function(resolve, reject) {
            if(article instanceof Array) {
                var promises = [];
                for(var i = 0; i < article.length; i++) {
                    if(article[i]) {
                        (function(thisArticle) {
                            select.articleBase(thisArticle.id).then(function(baseArticle) {
                                //Only push the article into a promice of the returned base article is undefined
                                if(!baseArticle) {
                                    promises.push(module.exports.articleFull(thisArticle));
                                }
                            }).catch(function(err) {
                                //If no base article was found, push the promise
                                if(err === 'No results') {
                                    promises.push(module.exports.articleFull(thisArticle));
                                }
                            }); 
                        }(article[i]));   
                    }
                }
                return Promise.all(promises).then(function(res) {
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
                var promises = [];

                var completeFullArticle = function(article, userId, teamId) {
                    module.exports.articleBase(article).then(function() {
                        promises.push(module.exports.bookStatus(article.books, article.id, userId, teamId));
                        promises.push(module.exports.comment(article.comments, article.id));
                        promises.push(module.exports.tag(article.tags, article.id));

                        if(userId) {
                            promises.push(module.exports.articleStatusRead(article.id, userId));
                            if(teamId) {
                                promises.push(module.exports.articleStatusRemoved(article.id, teamId));
                                promises.push(module.exports.imageStatus(article.id, teamId, article.selectedImage));
                            }
                        }
                    }).catch(function(err) {
                        return reject(err);  
                    });
                }

                //Load images first, then article bases, then all others (to support FK dependencies);
                module.exports.image(article.images, article.id).then(function() {
                    completeFullArticle(article, userId, teamId)
                }).catch(function() {
                    completeFullArticle(article, userId, teamId);
                });
                
                return Promise.all(promises).then(function(res) {
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            }
        });
    },
    articleBase: function(article) {
        return new Promise(function(resolve, reject) {
            if(article instanceof Array) {
                var promises = [];
                for(var i = 0; i < article.length; i++) {
                    if(article[i]) {
                        (function(thisArticle) {
                            select.articleBase(thisArticle.id).then(function(foundArticles) {
                                if(!foundArticles[0]) {
                                    promises.push(module.exports.articleBase(thisArticle));
                                }
                            }).catch(function() {
                                promises.push(module.exports.articleBase(thisArticle));
                            }); 
                        }(article[i]));   
                    }
                }
                return Promise.all(promises).then(function(res) {
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
                const query = {
                    text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_BASE.sql')),
                    values: [
                        article.date,
                        article.id,
                        article.link,
                        article.text,
                        article.title,
                        module.exports.extractCustomProperties(article),
                        article.source
                    ],
                }
    
                module.exports.query(query, function(err) {
                    if(err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            }
        });
    },
    articleEdit: function(articleId, userId, teamId, title, text) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_EDIT.sql')),
                values: [articleId, userId, teamId, title, text]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                else 
                    console.log(DateTools.format.timestamptz(res.rows[0].timestamp));
                    return resolve(DateTools.format.timestamptz(res.rows[0].timestamp));
            });
        });
    },
    articleStatusRead: function(articleId, userId, teamId, isRead) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_STATUS_READ.sql')),
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
    articleStatusRemoved: function(articleId, userId, teamId, isRemoved) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_STATUS_REMOVED.sql')),
                values: [articleId, userId, teamId, isRemoved]
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
    bookStatus: function(bookId, articleId, userId, teamId) {
        return new Promise(function(resolve, reject) {
            if(bookId instanceof Array) {
                var promises = [];
                for(var i = 0; i < bookId.length; i++) {
                    if(bookId[i]) {
                        (function(thisId) {
                            if(thisId.id) {
                                thisId = thisId.id
                            }
                            select.bookStatusByIds(thisId, articleId, teamId).then(function(statuses) {
                                if(!statuses[0]) {
                                    promises.push(module.exports.bookStatus(thisId, articleId, userId, teamId));
                                }
                            }); 
                        }(bookId[i]));   
                    }
                }
                return Promise.all(promises).then(function(res) {
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
                if(isNaN(bookId) && bookId.id) {
                    bookId = bookId.id;
                }
                const query = {
                    text: tools.readQueryFile(path.join(__dirname, 'INSERT_BOOK_STATUS.sql')),
                    values: [bookId, articleId, teamId, userId]
                }
                module.exports.query(query, function(err, res) {
                    if(err) {
                        return reject(err);
                    }
                    else
                        return resolve(res);
                });
            }
        });
    },
    comment: function(articleId, comment) {
        return new Promise(function(resolve, reject) {
            if(!comment && comment.length == 0) {
                return reject ('Missing required parameters');
            }

            if(!comment.user || (typeof comment.user.id === 'undefined' || typeof comment.user.teamId === 'undefined')) {
                console.log('no user info found');
                return resolve([]);
            }
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_COMMENT.sql')),
                values: [articleId, comment.user.id, comment.date, comment.text, comment.user.teamId]
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
    extractCustomProperties: function(article) {                
        //Article class. TODO: actually make this a class in a separate file (and share it)
        class Article {
            constructor() {
                this.active = false,
                this.activeInBook = false,
                this.books = [],
                this.build = false,
                this.comments = [],
                this.date = {},
                this.edits = [],
                this.id = '',
                this.images = [],
                this.inBook = false,
                this.inFeed = true,
                this.isEdit = false,
                this.link = '',
                this.read = false,
                this.selectedImage = 0,
                this.source = '',
                this.tags = [],
                this.text = '',
                this.title = ''
            }
        }

        const baseCompare = new Article();
        var customProperties = {};

        var baseKeys = Object.keys(baseCompare);
        var articleKeys = Object.keys(article);

        //If both objects have same number of keys (or the base has more), return empty object
        if(baseKeys.length >= articleKeys.length ) {
            return {};
        }

        for(var i = 0; i < articleKeys.length; i++) {
            var isStandard = false;
            for(var j = 0; j < baseKeys.length; j++) {
                if(articleKeys[i] == baseKeys[j]) {
                    isStandard = true;
                    break;
                }
            }
            if(!isStandard) {
                customProperties[articleKeys[i]] = article[articleKeys[i]];
            }
        }

        return customProperties;
    },
    image: function(uri, articleId) {
        return new Promise(function(resolve, reject) {
            if(uri instanceof Array) {
                var promises = [];
                for(var i = 0; i < uri.length; i++) {
                    if(uri[i]) {
                        (function(thisUri) {
                            select.imagesByUriAndArticleId(thisUri, articleId).then(function(images) {
                                if(!images[0]) {
                                    promises.push(module.exports.image(thisUri, articleId));
                                }
                            });
                        }(uri[i]));   
                    }
                }
                return Promise.all(promises).then(function(res) {
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
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
            }
        });
    },
    imageStatus: function(articleId, teamId, selectedImageId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_IMAGE_STATUS.sql')),
                values: [articleId, teamId, selectedImageId]
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
            if(name instanceof Array) {
                var promises = [];
                for(var i = 0; i < name.length; i++) {
                    if(name[i]) {
                        (function(thisName) {
                            select.tagsByNameAndArticleId(thisName, articleId).then(function(statuses) {
                                if(!statuses[0]) {
                                    promises.push(module.exports.tag(thisName, articleId));
                                }
                            });
                        }(name[i]));   
                    }
                }
                return Promise.all(promises).then(function(res) {
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
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
            }
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