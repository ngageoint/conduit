var query = undefined;
const path = require('path')
const tools = require(path.join(__dirname, '..','..','db-tools.js'));

/*TODO change our callback structure to a Promise structure.
So intead of doing select.baseArticle(id, callback), we can do a 
select.baseArticle(id).then(){}. It's a much more flexible structure
for reusing queries accross the api. (eg. an insert should check
for an existing pk first; with this we can do a 
select.then(insert)*/

var selectFullArticle = function(id, callback) {

    var promises = []; //h*ck


    //maybe instead of .all, chain with .then() to build article.books > .images etc
    //Then return a single promise that can be resolved by .all in higher function
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
/*
    baseArticle(id)
        .then(booksByArticle(id))
        .then(imagesByArticle(id))
        .then(commentsByArticle(id)
        .then(tagsByArticle(id))
        .then(function(res) {
            console.log(res);
            callback(res);
        });*/

    /*promises in order:
        0:base, 1:books[object], 2:images[string], 3:comments[object], 4:tags[string]
    */
    return Promise.all(promises).then(function(res) {     
        var article = res[0];
        article.books = res[1];
        article.images = res[2];
        article.comments = res[3];
        article.tags = res[4];

        callback(article);
    });			
}

module.exports = {
    setQueryManager: function(query) {
        this.query = query;
    },
    fullArticle: function(id, callback) {

        if(typeof id === "string")
        {
            selectFullArticle(id, callback);
            return;
        }

        //No support for Arrays yet....
        if(id instanceof Array)
        {
            var promises = [];

                for(var i = 0; i < id.length; i++)
                    if(typeof id[i] === "string")
                        articles.push(selectFullArticle(id));


            return (Promise.all(promises).then(function(res) {
                console.log(res);
            }).then(function(res) {
                console.log(res);
                callback(res);
            }));	
        }

        return; 		
    },
    baseArticle: function(id, callback)
    {
        if(!(id instanceof Array))
            id = JSON.parse('[' + id + ']');
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'SELECT_MULTIPLE_BASE_ARTICLES.sql')),
            values: [id],
        }
        console.log(id);
        console.log(id instanceof Array);
console.log(query.text);

        this.query(query, function(err, res) {            
            if(err) {
                return console.error('error running query', err);
            }
            if(res.rows)
            {
                if(typeof id === "string")
                    callback(res.rows[0]);
                else if (id instanceof Array)
                    callback(res.rows);
            }
            else
                callback('undefined');
        });
    },
    booksByArticle: function(id, callback) {
        const query = {
            text: tools.readQueryFile(path.join(__dirname, 'SELECT_BOOKS_BY_ARTICLE.sql')),
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
            text: tools.readQueryFile(path.join(__dirname, 'SELECT_IMAGES_BY_ARTICLE.sql')),
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
            text: tools.readQueryFile(path.join(__dirname, 'SELECT_COMMENTS_BY_ARTICLE.sql')),
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
            text: tools.readQueryFile(path.join(__dirname, 'SELECT_TAGS_BY_ARTICLE.sql')),
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
                    tags.push(res.rows[i]['tag']);
                callback(tags);
            }
            else
                callback('undefined');
        });
    },
    imageById: function() {
        this.query(tools.readQueryFile(path.join(__dirname, 'SELECT_IMAGE.sql')), [id], function(err, res) {
            if(err) {
                return console.error('error running query', err);
            }
            for(var i = 0; i < res.rows.length; i++)
                console.log('row ' + i + ':', res.rows[i]);
        });
    }
}
