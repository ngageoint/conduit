/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
angular.module('conduit.services').factory('BooksService', function($http, UserService) { 
	
	var books = UserService.getUser().then(function(user) {
		var query = '/select/booksByTeam?teamId=' + user.teamId;
		console.log(user);
		console.log(query);
		return $http.get(query).then(function(response) {
			console.log(response.data);
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