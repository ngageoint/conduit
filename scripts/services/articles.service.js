/* The ArticlesService makes all of the articles available in a global, editable promise. */
angular.module('conduit.services').factory('ArticlesService', function($q, $http, DataSourceService, RssLiteService, ComplexPropertyTools, __config) { 

	var articles = 	DataSourceService.getSources().then(function(sources) {
		return $q.all([
			$http.get(__config.articlesUrl)
				.then(function(response) {
					return response.data;
				}),
			RssLiteService.readUrl('https://alerts.weather.gov/cap/wa.php?x=1')
				.then(function(feed) {
					return formatRss(feed, sources[1]);
			})
		]).then(function(results) {
			var fullRes = [];
			for(var i = 0; i < results.length; i++)
				fullRes = fullRes.concat(results[i]);
			return fullRes;
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
			temp.source = source.name
			articles.push(forceArticleCompliance(temp));
		}

		for(var i = 0; i < articles.length; i++)
			for(var j = 0; j < source.tags.length; j++)
				articles[i].tags.push(ComplexPropertyTools.getComplexProperty(articles[i], source.tags[j]));

		return articles;
	}

//req date, id, title, text, images, selectedImage, tags, books, comments, wasRead, inFeed, source

//Force the article to have the minimum fields and set defaults if none given
	var forceArticleCompliance = function(article) {
		//Set booleans
		if(typeof article.wasRead == "undefined")
			article.wasRead = false;
		if(typeof article.inFeed == "undefined")
			article.inFeed = true;

		//Set fields created by conduit
		if(typeof article.books == "undefined")
			article.books = [];
		if(typeof article.comments == "undefined")
			article.comments = [];

		//Set fields required by conduit
		if(typeof article.date === "undefined")
			article.date = new Date();
		if(!article.id || article.id === "")
			article.id = generateUUID();
		if(typeof article.title === "undefined")
			article.title = "";
		if(typeof article.text === "undefined")
			article.text = "";
		if(typeof article.images === "undefined")
			article.images = [];
		if(typeof article.selectedImage === "undefined")
			article.selectedImage = 0;
		if(typeof article.tags === "undefined")
			article.tags = [];
		if(typeof article.source === "undefined")
			article.source = "";

		return article;
	}

	//RFC4122 version 4 compliant; the chance of a collision is less than 1 in 2.71 quintillion
	var generateUUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
		});
	}
	
	return {
	  getArticles: getArticles,
		formatRss: formatRss
	};		
});