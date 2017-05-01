/* The ArticlesService makes all of the articles available in a global, editable promise. */
angular.module('conduit.services').factory('ArticlesService', function($q, $http, __config) { 
	var articles = $q.all([	$http.get(__config.articlesUrl)
		.then(function(response) {
			return response.data;
		})
	]).then(function(results) {
		return results[0];
	});		
	
    var getArticles = function() {
		return articles;
	};
	
	return {
	  getArticles: getArticles
	};		
});