var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const DateTools = require(path.join('..', '..', '..', 'tools', 'date.tools.js'));

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
                if(res.rows && res.rows[0]) {
                    //Move custom properties up to make obj more flat
                    if(res.rows[0].custom_properties) {
                        for (var key in res.rows[0].custom_properties) {
                            if (res.rows[0].custom_properties.hasOwnProperty(key)) {
                                res.rows[0][key] = res.rows[0].custom_properties[key];
                            }
                        }
                    }
                    delete res.rows[0].custom_properties
                    return resolve(res.rows[0]);
                }
                else {
                    return reject('No results');
                }
            });
        });
    },
    articleBlock: function(userId, teamId, fromDate, numArticles, startingId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_IDS.sql')),
                values: [fromDate],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0]) {
                    var articles = res.rows;
                    numArticles = parseInt(numArticles);
                    var promises = []
                    //Find the starting point
                    for(var i = 0; i < articles.length; i++) {
                        if(articles[i].id == startingId || !startingId) {
                            if(startingId) {
                                i++;
                            }
                            for(var j = i; j < articles.length && j < i + numArticles; j++) {
                                (function(thisId) {
                                    promises.push(module.exports.articleFull(thisId, userId, teamId));
                                })(articles[j].id);
                            }
                            break;
                        }
                    }
                    return Promise.all(promises).then(function(res) {
                        var data = {
                            count: articles.length,
                            articles: res
                        }                  
                        return resolve(data);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                    return reject('No results for articleBlock');
                }
            });
        });
    },
    articleFull: function(articleId, userId, teamId) {
        return new Promise(function(resolve, reject) {
            var promises = [];

            promises.push(module.exports.articleBase(articleId));//0
            promises.push(module.exports.booksByArticle(articleId, teamId));//1
            promises.push(module.exports.imagesByArticle(articleId));//2
            promises.push(module.exports.imageStatusByIds(articleId, teamId));//3
            promises.push(module.exports.commentsByArticle(articleId, teamId));//4
            promises.push(module.exports.tagsByArticle(articleId));//5
            promises.push(module.exports.mostRecentArticleEdit(articleId, teamId));//6
            promises.push(module.exports.allEditsForArticleByTeam(articleId, teamId));//7
            if(userId) {
                promises.push(module.exports.articleStatusReadByIds(articleId, userId));//opt: 8
            } 
            if(teamId) {
                promises.push(module.exports.articleStatusRemovedByTeam(articleId, teamId));//opt: 8 or 9
            }


            /*promises in order:
            0:base, 1:books[object], 2:images[string], 3:selectedImage
            4:comments[object],5:tags[string], 6:status[boolean], 6:edit
            */
            return Promise.all(promises).then(function(res) {
                var article = res[0];
                article.books = res[1];
                article.images = res[2];
                article.selectedImage = res[3];
                article.comments = res[4];
                article.tags = res[5];
                
                if(res[6].title) {
                    article.isEdit = true;

                    //TODO: No need to set article.text; simply put logic in UI to pick the most recent edit
                    //Don't forget to add new edits to the local array before pushing
                    article.title = res[6].title;
                    article.text = res[6].text;
                }

                article.edits = res[7];

                //If there are 8 results, both read and removed were promised
                //In this case, 7 will be read, and 8 will be removed
                if(res[9]) {
                    article.read = res[8];
                    article.removed = res[9];
                } else {
                    //Otherwise, we have to check what the input was to determine
                    //what property res belongs to
                    if(userId) {
                        article.read = res[8];
                    } else if (teamId) {
                        article.removed = res[8];
                    }
                }
                return resolve(article);
            }).catch(function(err) {
                return reject(err);
            });
        });
    },
    articleOriginal: function(article) {
        return new Promise(function(resolve, reject) {
            return module.exports.articleBase(article.id).then(function(baseArticle) {
                article.title = baseArticle.title;
                article.text = baseArticle.text;
                article.isEdit = false;
                return resolve(article);
            }).catch(function(err) {
                return reject(err);
            });
        })
        
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
                    //console.log('No results for articleStatusReadByIds where articleId='+ articleId + " and userId=" + userId)
                    return resolve(false);
                }
            });
        });
    },
    articleStatusRemovedByTeam: function(articleId, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_STATUS_REMOVED_BY_TEAM.sql')),
                values: [articleId, teamId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0] && typeof res.rows[0].removed !== "undefined") {
                    return resolve(res.rows[0].removed);
                } else {
                    return resolve(false);
                }
            });
        });
    },
    attributes: function(id) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ATTRIBUTES.sql'))
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows) {
                    return resolve(res.rows);
                }
                else
                    return reject('No results for commentsByArticle where id=' + id);
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
                    return reject('No results for booksByTeam where teamId=' + teamId);
            });
        });
    },
    booksByArticle: function(id, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_BOOKS_BY_ARTICLE.sql')),
                values: [id, teamId],
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
    bookStatusByIds: function(bookId, articleId, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_BOOK_STATUS_BY_IDS.sql')),
                values: [bookId, articleId, teamId],
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
    imageStatusByIds: function(articleId, teamId) {
        return new Promise(function(resolve, reject) { 
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_IMAGE_STATUS_BY_IDS.sql')),
                values: [articleId, teamId],
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0] && res.rows[0].image_id)
                {
                    return resolve(res.rows[0].image_id);
                }
                else {
                   return resolve(undefined);
                }
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
    mostRecentArticleEdit: function(articleId, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_MOST_RECENT_ARTICLE_EDIT.sql')),
                values: [
                    articleId instanceof Object ? articleId.id : articleId,
                    teamId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0]) {
                    if(articleId instanceof Object) {
                        articleId.isEdit = true;
                        articleId.title = res.rows[0].title;
                        articleId.text = res.rows[0].text;

                        return resolve(articleId);
                    } else {
                        return resolve(res.rows[0]);
                    }
                }
                else {
                    return resolve(false);
                }
            });
        });
    },
    allEditsForArticleByTeam: function(articleId, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_ARTICLE_EDITS_BY_TEAM.sql')),
                values: [
                    articleId instanceof Object ? articleId.id : articleId,
                    teamId]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows) {
                    var edits = [];
                    for(var i = 0; i < res.rows.length; i++) {
                        let edit = {
                            teamId: teamId,
                            timestamp: DateTools.format.timestamptz(res.rows[i].timestamp),
                        }
                        edits.push(edit);
                    }
                    return resolve(edits);
                } else {
                    return resolve([]);
                }
            });
        });
    },
    editContent: function(articleId, teamId, timestamp) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_EDIT_CONTENT.sql')),
                values: [
                    articleId instanceof Object ? articleId.id : articleId,
                    teamId,
                    timestamp]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0]) {
                        let edit = {
                            userId: res.rows[0].user_id,
                            timestamp: timestamp,
                            title: res.rows[0].title,
                            text: res.rows[0].text
                        }
                    return resolve(edit);
                } else {
                    return resolve({});
                }
            });
        });
    },
    commentsByArticle: function(id, teamId) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_COMMENTS_BY_ARTICLE.sql')),
                values: [id, teamId],
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
    },
    userById: function(id) {
        return new Promise(function(resolve, reject) {
            const query = {
                text: tools.readQueryFile(path.join(__dirname, 'SELECT_USER_BY_ID.sql')),
                values: [id]
            }
            module.exports.query(query, function(err, res) {
                if(err) {
                    return reject(err);
                }
                if(res && res.rows && res.rows[0]) {
                    var user = {
                        id: res.rows[0].id,
                        teamId: res.rows[0].team_id,
                        teamName: res.rows[0].name,
                        given_name: res.rows[0].name_preferred
                    }
                    
                    return resolve(user);
                }
                else
                    return reject('No results for user where id=' + id);
            });
        });
    }
}
