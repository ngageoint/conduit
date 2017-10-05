angular.module('conduit.controllers').controller('ViewerCtrl', function($q, $scope, $rootScope, $timeout, __config, ApiService, ArrayTools, DateTools) {
	
	//If the current article has been added to or removed from a book, send out a broadcast to trigger a book update
	$scope.$watch('articles[currentIndex].books', function(newBooks, oldBooks) {		
		if(newBooks && oldBooks) {
			var sameBooks = [];
			for(var i = 0; i < newBooks.length; i++) {
				for(var j = 0; j < oldBooks.length; j++) {
					if(newBooks[i].id === oldBooks[j].id)
						sameBooks.push(newBooks[i]);
				}
			}
			//.parse/stringify() is added to protect from reference errors that would overwrite the article's books
			var addedBooks = JSON.parse(JSON.stringify(newBooks));
			addedBooks = ArrayTools.diff(addedBooks, sameBooks);
			if(addedBooks.length > 0) {
				ApiService.insert.bookStatus(addedBooks, $scope.articles[$scope.currentIndex].id).then(function(res) {
					console.log(res);
				});
			}

			var removedBooks = JSON.parse(JSON.stringify(oldBooks));
			removedBooks = ArrayTools.diff(removedBooks, sameBooks);
			if(removedBooks.length > 0) {
				ApiService.delete.bookStatus(removedBooks, $scope.articles[$scope.currentIndex].id).then(function(res) {
					console.log(res);
				})
			};
		}

		$rootScope.$broadcast('update-book');
	});
	
	$scope.imageIndex = 0;
	
	/**
	 * Navigate the image index to the previous image, if it exists. Called by ng-click of navBefore element
	 */
	$scope.navBefore = function()
	{
		if($scope.articles[$scope.currentIndex].selectedImage > 0)
			$scope.articles[$scope.currentIndex].selectedImage--;
	}
	
	/**
	 * Navigate the image index to the next image, if it exists. Called by ng-click of navNextelement
	 */
	$scope.navNext = function()
	{
		if($scope.articles[$scope.currentIndex].selectedImage < $scope.articles[$scope.currentIndex].images.length - 1)
			$scope.articles[$scope.currentIndex].selectedImage++;
	}

	//TODO: track by userId
	/**
	 * Add a new comment to this article.
	 * 
	 * @param {string} newComment The comment to be added.
	 */
	$scope.post = function(newComment) {
		if(newComment)
		{										
			dateStr = DateTools.formatDate(new Date,'yyyy\/MM\/dd HH:mm:ss');

			//If no comments exist yet, create the array and add it to the current article
			if(!$scope.articles[$scope.currentIndex].comments)
				$scope.articles[$scope.currentIndex].comments = [];
			//Comments follow this data format: {user, text, date};
			$scope.articles[$scope.currentIndex].comments.push({user: $scope.user.given_name, text: newComment, date: dateStr});
		}
	}	

	$scope.submitEdit = function() {
		ApiService.insert.articleEdit(	$scope.articles[$scope.currentIndex].id, 
										1, 
										1, 
										$scope.articles[$scope.currentIndex].title, 
										$scope.articles[$scope.currentIndex].text)
							.then(function(res) {
								console.log("Edit post success");
								console.log(res);
							}).catch(function(err) {
								console.log(err);
							})
	}
});