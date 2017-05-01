angular.module('conduit.controllers').controller('PageCtrl', function ($scope, $filter, ArticlesService, AttributesService, BooksService, ArrayTools) {
		
	ArticlesService.getArticles().then(function(data) {
		$scope.articles = data;
		
		//Add the first(__config.MIN_RENDERED_CARDS * 2) cards to the DOM so the user has something to start with.
		//Enough cards must be added to ensure that scrolling is possible so the infinite scroll event will be triggered
		for(var i = 0; i < __config.MIN_RENDERED_CARDS * 2 && i < $scope.articles.length; i++)
			$scope.articles[i].display = true;
		if($scope.articles[0])
		{
			$scope.articles[0].active = true;
			$scope.articles[0].activeInBook = false;
		}				
		
	}).catch( function() {
			
	});
	
	AttributesService.getAttributes().then( function(data) {
		$scope.attributes = data;
	}).catch( function() {
			
	});	
	
	BooksService.getBooks().then( function(data) {
		$scope.books = data;
		if($scope.books[0])
			$scope.selectedBook = $scope.books[0];
	}).catch( function() {
			
	});
	
	$scope.user = {
			name: '',
		};
	
	$scope.setUserInfo = function (user) {
			if(user.name && user.name != '')
			$scope.user.name = user.name;
		if($scope.user.name == '')
			$scope.user.name = "Unknown User";
	}
	
	//Card Activation
		
		//These variables keep track of the last element that was selected
		$scope.currentParent = 'Feed';
		$scope.currentIndex = 0;
		
		$scope.activateCard = function(parent, id) {	
			var index;
			
			if(!$scope.articles)
				return;
			
			if(id)
				index = ArrayTools.getIndex($scope.articles, id);
			
			//Set the old article to be inactive and read
			$scope.articles[$scope.currentIndex].active = false;
			$scope.articles[$scope.currentIndex].read = true;
			
			/*If no parent or index are given, pick the next card to be selected based on the last known selection
				Order:
					1st visible element below in current parent
					1st visible element above in current parent
					1st visible element in the opposite parent*/
			if(!parent && !index)
			{
				parent = $scope.currentParent
				//Check current parent
				for(var i = $scope.currentIndex; i < $scope.articles.length; i++)
					if($scope.articles[i]["in" + parent])
					{
						index = i;
						break;
					}
				if(!index)
					for(var i = $scope.currentIndex; i >= 0; i--)
						if($scope.articles[i]["in" + parent])
						{
							index = i;
							break;
						}
				
				//Switch to other parent
				if(!index)	
					switch(parent) {
						case 'Feed':
							parent = 'Book';
							break;
						default:
							parent = 'Feed';
							break;
					}
				if(!index)
					for(var i = 0; i < $scope.articles.length; i++)
						if($scope.articles[i]["in" + parent])
						{
							index = i;
							break;
						}
			}
			
			if(!index)
				index = 0;

			//Set the state of the new article to active
			$scope.articles[index].active = true;
			//Determine *where* the new article is active, based on the parent variable
			switch(parent) {
				case 'Feed':
					$scope.articles[index].activeInBook = false;
					break;
				default:
					$scope.articles[index].activeInBook = true;
					break;
			}
			
			//Update trackers
			$scope.currentParent = parent;
			$scope.currentIndex = index;			
		}
	
	//Card Attributes
	
		$scope.showAttribute = function(_article, attr) {
			if(_article[attr.compare])
			{
				if((typeof(_article[attr.compare]) === "boolean") && _article[attr.compare])
					return true;
				if(_article[attr.compare].constructor === Array && _article[attr.compare].length > 0)
					return true;	
			}
			
			return false;
		}
});