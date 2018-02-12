angular.module('conduit.controllers').controller('ViewerCtrl', function($q, $scope, $rootScope, $timeout, __config, ApiService, KeyboardService, ArrayTools, DateTools) {
	
	
	
	$scope.imageIndex = 0;

	$scope.hasEdits = function () {
		if($scope.articles && $scope.articles[$scope.currentIndex] && $scope.articles[$scope.currentIndex].edits) {
			return ($scope.articles[$scope.currentIndex].edits.length > 0);
		} else {
			return false;
		}
	}

	$scope.getOriginalArticle = function() {
		ApiService.select.articleOriginal($scope.articles[$scope.currentIndex]).then(function(article) {
			$scope.articles[$scope.currentIndex] = article;
		});
	}

	$scope.getMostRecentEdit = function() {
		ApiService.select.mostRecentArticleEdit($scope.articles[$scope.currentIndex]).then(function(article) {
			$scope.articles[$scope.currentIndex] = article;
		});
	}

	$scope.lastVersionViewState = false;
	$scope.versionsView = function(enabled) {
		//If it is a boolean, change the state
		if(typeof enabled === "boolean") {
			$scope.lastVersionViewState = enabled;
			if(enabled === true) {
				$scope.selectedVersion = $scope.articles[$scope.currentIndex].edits.length + 1;
			} else {
				$scope.getArticleVersion( $scope.articles[$scope.currentIndex].edits.length + 1);
			}
		} else {
			return $scope.lastVersionViewState;
		}
	}
	//Leave versions view if a new card is clicked
	$scope.$watch('currentIndex', function() {
        $scope.versionsView(false);
    });

	$scope.getArticleVersion = function(selectedVersion) {
		selectedVersion -= 2; //Pagination page starts at 1, and the original article is not represented in the edits array		

		$timeout(function() {
			if(selectedVersion >= 0) {
				ApiService.select.editContent(
					$scope.articles[$scope.currentIndex].id,
					$scope.articles[$scope.currentIndex].edits[selectedVersion]).then(function(version) {
						$scope.articles[$scope.currentIndex].title = version.title;
						$scope.articles[$scope.currentIndex].text = version.text;
				});
			} else {
				$scope.getOriginalArticle();
			}
		}, 100);
	}
	
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
			let dateStr = DateTools.formatDate(new Date(),'yyyy\/MM\/dd HH:mm:ss');

			//If no comments exist yet, create the array and add it to the current article
			if(!$scope.articles[$scope.currentIndex].comments)
				$scope.articles[$scope.currentIndex].comments = [];
			//Comments follow this data format: {user, text, date};
			var comment = {user: $scope.user, text: newComment, date: dateStr}
			$scope.articles[$scope.currentIndex].comments.push(comment);
			ApiService.insert.comment(comment, $scope.articles[$scope.currentIndex].id)
		}
	}	

	$scope.oldValues = {};

	$scope.cacheOldValues = function() {
		$scope.oldValues = {
			title: $scope.articles[$scope.currentIndex].title, 
			text: $scope.articles[$scope.currentIndex].text
		};
	}

	$scope.submitEdit = function() {

		/*
		$scope.articles[$scope.currentIndex].edits.push({
			title: $scope.articles[$scope.currentIndex].title,
			text: $scope.articles[$scope.currentIndex].text
		})
		*/

		if(!($scope.oldValues.title === $scope.articles[$scope.currentIndex].title && $scope.oldValues.text === $scope.articles[$scope.currentIndex].text)) {
				$scope.articles[$scope.currentIndex].isEdit = true;
				ApiService.insert.articleEdit(	$scope.articles[$scope.currentIndex].id,
												$scope.articles[$scope.currentIndex].title, 
												$scope.articles[$scope.currentIndex].text)
									.then(function(edit){
										$scope.articles[$scope.currentIndex].edits.push(edit);
									}).catch(function(err) {
										console.log(err);
									})
			}
	}
});