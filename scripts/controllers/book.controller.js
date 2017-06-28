angular.module('conduit.controllers').controller('BookCtrl', function($scope, $rootScope, BooksService, ArrayTools) {
		
	$scope.$watch('selectedBook', function() {
		$scope.updateBook();
	});
	
	$scope.$on('update-book', function(event, args) {
		$scope.updateBook($scope.currentIndex);
	})
	
	$scope.updateBook = function(index) {
		if($scope.selectedBook && $scope.articles)
		{				
			for(var i = 0; i < $scope.books.length; i++)
				$scope.books[i].count = 0;
			
			for(var i = 0; i < $scope.articles.length; i++)
			{
				$scope.articles[i].inBook = false;
				for(var j = 0; j < $scope.articles[i].books.length; j++)
				{
					for(var k = 0; k < $scope.books.length; k++)
						if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.books[k].name))
							$scope.books[k].count++;
							
					if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.selectedBook.name))
							$scope.articles[i].inBook = true;
							
				}
			}
		}	
	}
		
	//Remove
	$scope.remove = function (id) {
		
		index = ArrayTools.getIndex($scope.articles, id);
		
		$scope.articles[index].inBook = false;
		$scope.articles[index].activeInBook = false;
		
		for(var i = 0; i < $scope.articles[index].books.length; i++)
			if(~$scope.articles[index].books[i].name.indexOf($scope.selectedBook.name))
				$scope.articles[index].books = ArrayTools.removeElement($scope.articles[index].books, i);
		$scope.updateBook();
		$scope.activateCard('Feed', id);
	}	
});