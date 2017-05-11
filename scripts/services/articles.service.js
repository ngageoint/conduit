/* The ArticlesService makes all of the articles available in a global, editable promise. */
angular.module('conduit.services').factory('ArticlesService', function($q, $http, DataSourceService, RssLiteService, __config) { 

	var articles = 	DataSourceService.getSources().then(function(sources) {
		return $q.all([
			$http.get(__config.articlesUrl)
				.then(function(response) {
					return response.data;
				}),
			RssLiteService.readUrl('https://alerts.weather.gov/cap/wa.php?x=1')
				.then(function(feed) {
					console.log(feed);
					return formatRss(feed, sources[1]);
			})
		]).then(function(results) {
			for(var i = 0; i < results.length; i++)
				console.log(results[i]);
			return results[0].concat(results[1]);
		});			
	});
	
  var getArticles = function() {
		return articles;
	};

	var formatRss = function(feed, source)
	{
		var articles = [];
		for(var i = 0; i < feed.length; i++)
		{
			var temp = {};
			for(var j = 0; j < source.binding.length; j++)
				temp[source.binding[j].local] = feed[i][source.binding[j].source];
			articles.push(forceArticleCompliance(temp));
		}	

		return articles;
	}

//req date, id, title, text, images, selectedImage, tags, books, comments, wasRead, inFeed, source

//Force the article to have the minimum fields and set defaults if none given
	var forceArticleCompliance = function(article) {
		//Set booleans
		if(typeof article.wasRead == "undefined")
			article.wasRead = false;
		if(typeof article.inFeed == "undefined")
			article.inFeed = false;

		//Set fields created by conduit
		if(typeof article.books == "undefined")
			article.books = [];
		if(typeof article.comments == "undefined")
			article.comments = [];

		//Set fields required by conduit
		if(typeof article.date == "undefined")
			article.date = new Date();
		if(typeof article.id == "undefined")
			article.id = generateUUID();
		if(typeof article.title == "undefined")
			article.title = "";
		if(typeof article.text == "undefined")
			article.text = "";
		if(typeof article.images == "undefined")
			article.images = [];
		if(typeof article.selectedImage == "undefined")
			article.selectedImage = 0;
		if(typeof article.tags == "undefined")
			article.tags = [];
		if(typeof article.source == "undefined")
			article.source = "";

		return article;
	}

	//RFC4122 version 4 compliant; the chance of a collision is less than 1 in 2.71 quintillion
	var generateUUID = function() {
		'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
		});
	}
	
	return {
	  getArticles: getArticles,
		formatRss: formatRss
	};		
});