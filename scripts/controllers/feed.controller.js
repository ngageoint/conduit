angular.module('conduit.controllers').controller('FeedCtrl', function(
	$scope, $timeout, __config, ArticlesService, DataSourceService, ComplexPropertyTools,
	ArrayTools, DateTools, FilterService, RssLiteService) {
					
	FilterService.filter.trash = $scope.cbxTrash;
	$scope.filter = FilterService.filter;	

	//Setup Filter
	//The filter needs the articles loaded to be built, so we wait from articles to load; no data is passed since we inherit articles
	ArticlesService.getArticles().then(function() {
		DataSourceService.getSources().then( function(sourceData) {
			console.log($scope.articles);
			$scope.sources = FilterService.build(sourceData, $scope.articles);
		}).catch( function(err) {
			console.log(err);
		});
	}).catch( function(err) {
		console.log(err);
	});

	

	//Setup events for drop downs in filter
	//Is not very smooth; but may be worth improving in the future
	$scope.closeDropDownOnDelay = function($event, delay)
	{
		if(!$event)
			return;
		if(!delay)
			delay = 500;
		
		element = angular.element($event.currentTarget);
			$timeout(function() {
			element.removeClass('open');
		}, delay);
   	}
	
	//Update the options that are visible in the filter based on other options that are selected.
	$scope.updateFilterOptions = function(source, filter)
	{
		//Current issue: updateOptions makes cards dissapear (something with determineShow?)
		$scope.sources = FilterService.updateOptions($scope.sources, source, $scope.articles, filter, $scope.attributes) || $scope.sources;
	}
			
	$scope.refreshFeed = function() {
		if(!$scope.articles)
			return;
			
		if(FilterService.filter.daysBack < 1)
			FilterService.filter.daysBack = 1;
		if(FilterService.filter.daysBack > __config.MAX_DAYS_BACK)
			FilterService.filter.daysBack = __config.MAX_DAYS_BACK;
			
		$scope.filter.count = 0;
		for(var i = 0; i < $scope.articles.length; i++)
		{
			$scope.articles[i].inFeed = FilterService.determineShow($scope.articles[i], $scope.sources, $scope.attributes);
			if($scope.articles[i].inFeed)
				$scope.filter.count++;
		}
				
		$scope.buildMoreCards(__config.MIN_RENDERED_CARDS);
	}
			
	$scope.$watch('attributes[0].checked', function() {
		$scope.refreshFeed();
	});
			
	//Remove feature
	$scope.remove = function (id) {
		
		index = ArrayTools.getIndex($scope.articles, id);
		
		$scope.articles[index].removed = true;
		$scope.articles[index].read = true;
		$scope.articles[index].inFeed = false;
		
		$scope.refreshFeed();
		$scope.activateCard();
	}
		
    //Restore feature
	$scope.restore = function (id) {
				
		index = ArrayTools.getIndex($scope.articles, id);
		
		$scope.articles[index].removed = false;
		$scope.articles[index].active = false;
		
		$scope.refreshFeed();
	}
			
	//InfiniteScroll
	$scope.buildMoreCards = function (numCards) {
		if(!$scope.articles)
			return;
		if(!numCards)
			numCards = (__config.MIN_RENDERED_CARDS / 2);
		
		for(var i = 0; i < $scope.articles.length; i++)
			if($scope.articles[i].inFeed && !$scope.articles[i].display)//Find the first article that should be shown, but hasn't been built yet
			{
				for(var j = i; j < i + numCards && j < $scope.articles.length; j++)//Iterate through numCards from there
				{
					if(!$scope.articles[j].inFeed)//If the article is not supposed to be in the feed, skip it and increment numCards
					{
						numCards++;
						continue;
					}
					$scope.articles[j].display = true;
					for(var k = 0; k < $scope.articles.length; k++)
						if(!$scope.articles[k].display)
						{
							$scope.articles = swap($scope.articles, j, k);
							break;
						}
				}
				break;
			}
	}
});