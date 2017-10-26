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
                    //Move custom properties up to make obj more flat
                    if(res.rows[0].custom_properties) {
                        console.log("has custom properties")
                        for (var key in res.rows[0].custom_properties) {
                            console.log("key: " + key)
                            if (res.rows[0].custom_properties.hasOwnProperty(key)) {
                                res.rows[0][key] = res.rows[0].custom_properties[key];
                                console.log(res.rows[0][key]);
                            }
                        }
                        delete res.rows[0].custom_properties
                    }
                    return resolve(res.rows[0]);
                }
                else {
                    return reject('No results');
                }
            });
        });
    },
    articleFull: function(articleId, userId, teamId) {
        return new Promise(function(resolve, reject) {
            var promises = [];

            promises.push(module.exports.articleBase(articleId));
            promises.push(module.exports.booksByArticle(articleId));
            promises.push(module.exports.imagesByArticle(articleId));
            promises.push(module.exports.commentsByArticle(articleId));
            promises.push(module.exports.tagsByArticle(articleId));
            if(userId) {
                promises.push(module.exports.mostRecentArticleEdit(articleId, userId, teamId || 1)); //TODO: update team info
                promises.push(module.exports.articleStatusReadByIds(articleId, userId));
            } else {
                promises.push(module.exports.mostRecentArticleEdit(articleId, 1, teamId || 1)); //TODO: update team info
            }
            console.log('!!!! team id: ' + teamId);
            if(teamId) {
                console.log('checking removed by team')
                promises.push(module.exports.articleStatusRemovedByTeam(articleId, teamId || 1));//TODO: update team info
            }


            /*promises in order:
            0:base, 1:books[object], 2:images[string], 3:comments[object], 4:tags[string], 5:status[boolean], 6:edit
            */
            return Promise.all(promises).then(function(res) {
                var article = res[0];
                article.books = res[1];
                article.images = res[2];
                article.comments = res[3];
                article.tags = res[4];
                if(res[5]) {
                    console.log("res[5]");
                    console.log(res[5]);
                    console.log(res[5].title);
                    article.isEdit = true;
                    article.title = res[5].title;
                    article.text = res[5].text;
                }
                if(res[6]) {
                    article.read = res[6];
                }
                if(res[7]) {
                    console.log(res[7]);
                    article.removed = res[7];
                }


                return resolve(article);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },
    articlesByUserFromDate: function(userId, fromDate, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLES_BASE_FROM_DATE.sql')),
                values: [fromDate],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0]) {
                    var promises = []
                    for(var i = 0; i < res.rows.length; i++) {
                        (function(thisId) {
                            console.log(thisId);
                            promises.push(module.exports.articleFull(thisId, userId, teamId));
                        })(res.rows[i].id);
                    }
                    return Promise.all(promises).then(function(res) {
                        return resolve(res);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                    return reject('No results for articlesByUserFromDate');
                }
            });
        });
    },
    articleStatusReadByIds: function(articleId, userId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_STATUS_READ_BY_IDS.sql')),
                values: [articleId, userId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0] && typeof res.rows[0].read !== "undefined") {
                    return resolve(res.rows[0].read);
                } else {
                    return reject('No results for articleStatusReadByIds where articleId='+ articleId + " and userId=" + userId);
                }
            });
        });
    },
    articleStatusRemovedByTeam: function(articleId, teamId) {
        return new Promise(function(resolve, reject) {
            console.log('REMOVED PROMISE');
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_STATUS_REMOVED_BY_TEAM.sql')),
                values: [articleId, teamId],
            }
            console.log('REMOVED QUERY');
            console.log(query);
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                console.log('REMOVED RESULTS');
                console.log(res);
                if(res && res.rows && res.rows[0] && typeof res.rows[0].removed !== "undefined") {
                    return resolve(res.rows[0].removed);
                } else {
                    return reject('No results for articleStatusRemovedByTeam where articleId='+ articleId + " and teamId=" + teamId);
                }
            });
        });
    },
    booksByTeam: function(teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_BOOKS_BY_TEAM.sql')),
                values: [teamId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows) {
                    return resolve(res.rows);
                }
                else
                    return reject('No results for booksByArticle where id=' + id);
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
                if(res && res.rows) {
                    return resolve(res.rows);
                }
                else
                    return reject('No results for booksByArticle where id=' + id);
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
                    return reject('No results for bookStatusByIds where bookId=' + bookId + ' and articleId=' + articleId);
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
                   return reject('No results for imagesByArticle where id=' + id);
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
                   return reject('No results for imagesByUriAndArticleId');
                });
        });
    },
    mostRecentArticleEdit: function(articleId, userId, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_MOST_RECENT_ARTICLE_EDIT.sql')),
                values: [articleId, userId, teamId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0]) {
                    return resolve(res.rows[0]);
                }
                else
                    return resolve(false);
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
                    return reject('No results for commentsByArticle where id=' + id);
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
                    return reject('No results for tagsByArticle where id='+id);
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
                    return reject('No results for tagsByNameAndArticleId where name=' + name + " and articleId=" + articleId);
            });
        });
    }
}
