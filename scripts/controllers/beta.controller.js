angular.module('conduit.controllers').controller('BetaCtrl', function ($scope, $rootScope, $http, ArticlesService, cfpLoadingBar) {
	
	$scope.loadState = function(files) {
		
		if(!files[0])
			return;
		
		try {
		
			fileURI = window.URL.createObjectURL(files[0]);
			if(!fileURI)
				fileURI = window.webkitURL.createObjectURL(files[0]);
			
			console.log(fileURI);
			
			$http.get(fileURI).then(function(response) {
					var savedArticles = response.data;
					
					var flag = false;
					
					var concatUnique = function(oldA, newA) {
						for(var i = 0; i < newA.length; i++)
						{
							var isUnique = true;
							for(var j = 0; j < oldA.length && isUnique; j++)
								if(oldA[j] == newA[i])
									isUnique = false
							if(isUnique)
								oldA.push(newA[i])
						}
						return oldA;		
					}
						
					if($scope.articles)
						for(var i = 0; i < savedArticles.length; i++)
						{
						 for(var j = 0; j < $scope.articles.length; j++)
							if(~$scope.articles[j].id.indexOf(savedArticles[i].id))
							{
								$scope.articles[j].books = concatUnique($scope.articles[j].books, savedArticles[i].books);
								$scope.articles[j].comments = concatUnique($scope.articles[j].comments, savedArticles[i].comments);
								$scope.articles[j].comments.sort(function(a, b){return a['dateTime'].localeCompare(b['dateTime'])});
								$scope.articles[j].title = savedArticles[i].title;
								$scope.articles[j].text = savedArticles[i].text;
								$scope.articles[j].selectedImage = savedArticles[i].selectedImage;
								flag = true;
								break;
							}
							if(flag)
								continue;
							}
						
					$rootScope.$broadcast('update-book');
					
				}).catch(function (data) {
					console.log("bad $http get");
					cfpLoadingBar.complete();
				});
				
		}catch(exception) {
			console.log("load failed");	
		}
	};
	
	$scope.saveState = function() {
		if(!$scope.articles)
			return;
			
		var jsonStr = JSON.stringify($scope.articles)
		var blob = new Blob([jsonStr], {type:"text"});
		var saveName = ($scope.user.name || "Saved State") + " " + $scope.formatDate(new Date()) + ".json";
		saveAs(blob, saveName);
	}
});