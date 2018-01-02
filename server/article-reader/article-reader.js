const path = require('path');
const hash = require('object-hash');
const axios = require('axios');

const RssLiteService = require('./rss-lite.service.js');
const ComplexPropertyTools = require(path.join('..', 'tools', 'complex-property.tools.js'));


//test url: 'https://alerts.weather.gov/cap/us.php?x=1'

module.exports = {
    readSource: function(source, conditioning) {
        return new Promise(function(resolve, reject) {

            //Test for RSS and process if true
            if(source.type.toLowerCase() === 'rss') {
                module.exports.readRss(source).then(function(articles) {
                    return resolve(articles);
                }).catch(function(err) {
                    return reject(err);
                });
            }

            //Test for special data conditioning (not available for RSS at this time);
            else if(conditioning) {
                var config = {
                    //TODO: Add auth config info
                }
        
                axios.get(source.link, config).then(function(res) {
                    return resolve(conditioning(res.data));
                }).catch(function(err) {
                    return reject(err);
                });
            }
            else {
                return reject('No available actions for this source');
            }
        });
    },
    readRss: function(source) {
        return new Promise(function(resolve, reject) {
            RssLiteService.readUrl(source.link).then(function(feed) {

                //Format RSS
                var articles = [];
                for(var i = 0; i < feed.length; i++)
                {
                    var temp = {};
                    for(var j = 0; j < source.binding.length; j++)
                        temp[source.binding[j].local] = feed[i][source.binding[j].source];
                    temp.source = source.name
                    articles.push(module.exports.forceArticleCompliance(temp));
                }
        
                //return $q.all(articles).then(function(articles) {
                for(var i = 0; i < articles.length; i++)
                {
                    articles[i].tags.push(source.tag);
                    for(var j = 0; j < source.tags.length; j++)
                        if(source.tags[j]) {
                            let tag = ComplexPropertyTools.getComplexProperty(articles[i], source.tags[j])
                            if(tag) {
                                articles[i].tags.push(tag);
                            }
                        }
                }
                return resolve(articles);
               // });

            }).catch(function(err) {
                return reject(err);
            });
        });
    },
    forceArticleCompliance: function(article) {
       // return new Promise(function(resolve, reject) {

            //Set hashable values first		
            if(typeof article.title == "undefined")
                article.title = "";
            if(typeof article.text == "undefined")
                article.text = "";
            if(typeof article.images == "undefined")
                article.images = [];
            if(typeof article.source == "undefined")
                article.source = "";

            //Generate hash, if no id
            if(!article.id || article.id === "") {
                article.id = hash(article);
            }
                
            //Set booleans
            if(typeof article.active == "undefined")
                article.active = false;
            if(typeof article.activeInBook == "undefined")
                article.activeInBook = false;
            if(typeof article.build == "undefined")
                article.build = false;
            if(typeof article.inBook == "undefined")
                article.inBook = false;
            if(typeof article.inFeed == "undefined")
                article.inFeed = true;
            if(typeof article.isEdit == "undefined")
                article.isEdit = false;
            if(typeof article.read == "undefined")
                article.read = false;

            //Set fields created by conduit
            if(typeof article.books == "undefined")
                article.books = [];
            if(typeof article.comments == "undefined")
                article.comments = [];
            if(typeof article.edits == "undefined")
                article.edits = [];

            //Set additional fields required by conduit
            if(typeof article.date == "undefined")
                article.date = new Date();
            if(typeof article.selectedImage == "undefined")
                article.selectedImage = 0;
            if(typeof article.tags == "undefined")
                article.tags = [];

            return article;
           // return resolve(article);
        //});
    }
}

source = {
	"tag":"NWS",
	"name":"National Weather Service",
	"link":"https://alerts.weather.gov/cap/us.php?x=1",
	"type":"rss",
	"binding":[{
			"local":"date",
			"source":"published"
		},{
			"local":"link",
			"source":"link"
		},{
			"local":"title",
			"source":"title"
		},{
			"local":"text",
			"source":"summary"
		},{
			"local":"cap:event",
			"source":"cap:event"
		},{
			"local":"cap:urgency",
			"source":"cap:urgency"
		},{
			"local":"cap:severity",
			"source":"cap:severity"
		},{
			"local":"cap:certainty",
			"source":"cap:certainty"
		}
	],
	"tags":["cap:event","cap:urgency","cap:severity","cap:certainty"],
	"checked":true,
	"filter":[{
		"name":"Event",
		"binding": {
			"property":"cap:event"
		},
		"values":[],
		"checked":false
	},{
		"name":"Urgency",
		"binding": {
			"property":"cap:urgency"
		},
		"values":[],
		"checked":false
	},{
		"name":"Severity",
		"binding": {
			"property":"cap:severity"
		},
		"values":[],
		"checked":false
    }]
}