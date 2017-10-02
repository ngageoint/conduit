/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
angular.module('conduit.services').factory('BooksService', function($http) { 
	
	//TODO: variablize teamId
	var query = '/select/booksByTeam?teamId=' + '1';
	
	var books = $http.get(query).then(function(response) {
		console.log(response.data);
		return response.data;
	});

	/*$http.get('data/books.json').then(function(response) {
		return response.data;
	});*/
	
	var getBooks = function() {
		return books;
	};
	
	return {
	  getBooks: getBooks
	};
});