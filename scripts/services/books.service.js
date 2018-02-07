/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
angular.module('conduit.services').factory('BooksService', function($http, UserService) { 
	
	var books = UserService.getUser().then(function(user) {
		var query = '/select/booksByTeam?teamId=' + user.teamId;
		return $http.get(query).then(function(response) {
			return response.data;
		});
	});
	
	var getBooks = function() {
		return books;
	};
	
	return {
		getBooks: getBooks
	};
});