var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));
const select = require(path.join(__dirname, '..','select','select.js'));

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
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
                                if(statuses[0]) {
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
                    text: tools.readQueryFile(path.join(__dirname, 'DELETE_BOOK_STATUS.sql')),
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
    }
};