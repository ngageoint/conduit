/* The ArticlesService makes all of the articles available in a global, editable promise. */
angular.module('conduit.services').factory('ArticlesService', function($q, $http, $timeout,
ApiService, BooksService, FilterService, ArrayTools, ComplexPropertyTools, DateTools, __config) { 
	
	var completeCompliance = function (article, books) {
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
		if(typeof article.edits == "undefined")
			article.edits = [];
			
		//Ensure articles with existing books are referencing the correct object
		if(article.books.length > 0 && books) {
			for(var i = 0; i < article.books.length; i++) {
				for(var j = 0; j < books.length; j++) {
					if(article.books[i].id === books[j].id)
						article.books[i] = books[j]
				}
			}
		}
		if(typeof article.comments == "undefined")
			article.comments = [];

		//Set additional fields required by conduit
		if(typeof article.date == "undefined")
			article.date = new Date();
		if(typeof article.selectedImage == "undefined")
			article.selectedImage = 0;
		if(typeof article.tags == "undefined")
			article.tags = [];

		return article;
	}

	//Force the article to have the minimum fields and set defaults if none given
	var forceArticleCompliance = function(article, books) {
		//return new Promise(function(resolve, reject) {

			//Set hashable values first		
			if(typeof article.title == "undefined")
				article.title = "";
			if(typeof article.text == "undefined")
				article.text = "";
			if(typeof article.images == "undefined")
				article.images = [];
			if(typeof article.source == "undefined")
				article.source = "";

			if(!article.id || article.id === "") {
				ApiService.generateHash(article).then(function(hash) {
					article.id = hash
					return completeCompliance(article, books);
				}).catch(function() {
					article.id = generateUUID();
					return completeCompliance(article, books);
				});
			} else {
				return completeCompliance(article, books);
			}	
		//});
	}

	//RFC4122 version 4 compliant; the chance of a collision is less than 1 in 2.71 quintillion
	var generateUUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
		});
	}

	var getAndProcessArticles = function() {
		var queries = [];

		queries.push(ApiService.select.articleBlock(DateTools.formatDate(new Date(new Date().setDate(new Date().getDate() - __config.MAX_DAYS_BACK)), 'yyyy-MM-dd'), 0).then(function(response) {
				return response.articles;
			})
		);
		
		//Request all promises from our queries array, concat them, and return
		return $q.all(queries).then(function(results) {
			var fullResponse = [];
			for(var i = 0; i < results.length; i++) {
				fullResponse = fullResponse.concat(results[i]);
			}

			return BooksService.getBooks().then(function(books) {
				var articles = []
				for(var i = 0; i < fullResponse.length; i++) {
					(function(article) {
						articles.push(forceArticleCompliance(article, books));
					})(fullResponse[i]);
				}
				return $q.all(articles).then(function(articles) {
					//Send articles to db
					//ApiService.insert.articleFull(articles);
					articles = ArrayTools.removeDuplicates(articles, function(thisArticle) {
						return thisArticle.id;
					});

					return articles;
				});
			}).catch(function() {
				return fullResponse
			});			
		});
	}
	
	var articles = getAndProcessArticles();
	
  	var getArticles = function() {
		return articles;
	};
	
	return {
	  	getArticles: getArticles,
		forceArticleCompliance: forceArticleCompliance
	};		
});