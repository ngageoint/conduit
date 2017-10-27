var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const select = require(path.join(__dirname, '..','select','select.js'));

module.exports = {
    setQueryManager: function(query) {
        module.exports.query = query;
    },
    articleFull: function(article, userId, teamId) {
        console.log('USER ID');
        console.log(userId);
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
                    module.exports.articleBase(article).then(function(res) {
                        promises.push(module.exports.articleStatusRead(article.id, userId));
                        promises.push(module.exports.articleStatusRemoved(article.id, teamId));
                        promises.push(module.exports.bookStatus(article.books, article.id));
                        promises.push(module.exports.comment(article.comments, article.id));
                        promises.push(module.exports.imageStatus(article.id, teamId, article.selectedImage));
                        promises.push(module.exports.tag(article.tags, article.id));
                    }).catch(function(err) {
                        console.log('ERROR IN BASE ARTICLE!!!!!!!!!!!!');
                        console.log(err);
                        return reject(err);  
                    });
                }

                //Load images first, then article bases, then all others (to support FK dependencies);
                module.exports.image(article.images, article.id).then(function(res) {
                    completeFullArticle(article, userId, teamId)
                }).catch(function(err) {
                    completeFullArticle(article, userId, teamId);
                });
                
                return Promise.all(promises).then(function(res) {
                    console.log('ALL PROMISES RESOLVED');
                    return resolve(res);
                }).catch(function(err) {
                    return reject(err);
                });
            }
        });
    },
    articleBase: function(article) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'INSERT_ARTICLE_BASE.sql')),
                values: [
                    article.date,
                    article.id,
                    article.link,
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
                console.log('SUCCESS IN BASE ARTICLE');
                return resolve(true);
            });
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
                    return resolve(res);
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
    bookStatus: function(bookId, articleId) {
        return new Promise(function(resolve, reject) {
            if(bookId instanceof Array) {
                var promises = [];
                for(var i = 0; i < bookId.length; i++) {
                    if(bookId[i]) {
                        (function(thisId) {
                            if(thisId.id) {
                                thisId = thisId.id
                            }
                            select.bookStatusByIds(thisId, articleId).then(function(statuses) {
                                if(!statuses[0]) {
                                    promises.push(module.exports.bookStatus(thisId, articleId));
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
            }
        });
    },
    //TODO: Once front end tracks comments by user id, userId param can be removed.
    //teamId should still be tracked separate bc there's no reason to attach team id to every
    //comment in the front end
    comment: function(articleId, userId, teamId, comment, date, text) {
        return new Promise(function(resolve, reject) {
            if((!date || !text) && !comment) {
                return reject ('Missing required parameters');
            }
            if(!date && comment && comment.date) {
                date = comment.date
            }
            if(!text && comment && comment.text) {
                text = comment.text
            }
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
                        console.log(err);
                        console.log('Db error where uri='+uri+' articleId='+articleId);
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
                values: [articleId, userId, selectedImageId]
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
                console.log(query.values);
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