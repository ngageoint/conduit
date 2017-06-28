angular.module('conduit.controllers').controller('ViewerCtrl', function($q, $scope, $rootScope, $timeout, __config) {
		
	$scope.$watch('articles[currentIndex].books', function() {
		$rootScope.$broadcast('update-book');
	});
	
	$scope.imageIndex = 0;
	
	//ng-click of navBefore element
	$scope.navBefore = function()
	{
		if($scope.articles[$scope.currentIndex].selectedImage > 0)
			$scope.articles[$scope.currentIndex].selectedImage--;
	}
	
	//ng-click of navNext element
	$scope.navNext = function()
	{
		if($scope.articles[$scope.currentIndex].selectedImage < $scope.articles[$scope.currentIndex].images.length - 1)
			$scope.articles[$scope.currentIndex].selectedImage++;
	}

	$scope.post = function(newComment) {
		if(newComment)
		{									
			var date = new Date;
			
					var hour = date.getHours();
					hour = hour < 10 ? '0' + hour : hour;
				var minute = date.getMinutes();
					minute = minute < 10 ? '0' + minute : minute;
				var second = date.getSeconds();
					second = second < 10 ? '0' + second : second;
				
				var month = date.getMonth() + 1;
					month = month < 10 ? '0' + month : month;
				var day = date.getDate();
					day = day < 10 ? '0' + day : day;
				var year = date.getFullYear();
				
				dateStr = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
			
			if(!$scope.articles[$scope.currentIndex].comments)
				$scope.articles[$scope.currentIndex].comments = [];
			$scope.articles[$scope.currentIndex].comments.push({user: $scope.user.name, text: newComment, dateTime: dateStr});
		}
	}	
});