angular.module('conduit.controllers').controller('BookCtrl', function($scope, $rootScope, BooksService, ArrayTools) {
	
	//Watch the selectedBook variable (bound to the dropdown); if changed, update the articles displayed in the book
	$scope.$watch('selectedBook', function() {
		$scope.updateBook();
	});
	
	//watches for broadcasts to update book after certain actions (such as a product being added to  a book)
	$scope.$on('update-book', function(event, args) {
		$scope.updateBook($scope.currentIndex);
	})
	
	/**
	 * 
	 * Updates the properties of articles to reflect whether or not they are being shown in the currently selected book
	 * 
	 * @param index The index of the current book; optional and does nothing idk why it's there but I'm not about to delete it
	 */
	$scope.updateBook = function(index) {
		if($scope.selectedBook && $scope.articles)
		{
			//Reset the counter for each book
			for(var i = 0; i < $scope.books.length; i++)
				$scope.books[i].count = 0;
			
			for(var i = 0; i < $scope.articles.length; i++)
			{
				//Assume the article is not being shown
				$scope.articles[i].inBook = false;
				for(var j = 0; j < $scope.articles[i].books.length; j++)
				{
					for(var k = 0; k < $scope.books.length; k++)
						//If a book contains the current article, increment the counter for that book
						if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.books[k].name))
							$scope.books[k].count++;
					//If the article is in the currently selected book, make sure it is being shown		
					if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.selectedBook.name))
							$scope.articles[i].inBook = true;
							
				}
			}
		}	
	}

	/**
	 * Given the id of an article, removes that article from the currently selected book or a specified book
	 * 
	 * @param id The id of the article to be removed from the book
	 * @param bookName The name of the book to remove the article from; optional. Default is currently selected book
	 */
	$scope.remove = function (id, bookName) {
		
		//Set defaults
		if(!bookName)
			bookName = $scope.selectedBook.name;

		//Find the article
		index = ArrayTools.getIndex($scope.articles, id);
		
		//Set properties to remove from book
		$scope.articles[index].inBook = false;
		$scope.articles[index].activeInBook = false;
		
		//Remove book from article.books
		for(var i = 0; i < $scope.articles[index].books.length; i++)
			if(~$scope.articles[index].books[i].name.indexOf(bookName))
				$scope.articles[index].books = ArrayTools.removeElement($scope.articles[index].books, i);
		
		//Update the view
		$scope.updateBook();
		$scope.activateCard('Feed', id);
	}	
});