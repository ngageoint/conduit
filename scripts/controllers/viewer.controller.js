angular.module('conduit.controllers').controller('ViewerCtrl', function($q, $scope, $rootScope, $timeout, __config, DateTools) {
	
	//If the current article has been added to or removed from a book, send out a broadcast to trigger a book update
	$scope.$watch('articles[currentIndex].books', function() {
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
			//Comments follow this data format: {user, text, dateTime};
			$scope.articles[$scope.currentIndex].comments.push({user: $scope.user.name, text: newComment, dateTime: dateStr});
		}
	}	
});