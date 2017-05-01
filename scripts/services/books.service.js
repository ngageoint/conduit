/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
angular.module('conduit.services').factory('BooksService', function($http) { 
	var books = $http.get('data/books.json').then(function(response) {
			return response.data;
		});
	
	var getBooks = function() {
		return books;
	};
	
	return {
	  getBooks: getBooks
	};
});