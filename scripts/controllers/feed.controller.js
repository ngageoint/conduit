angular.module('conduit.controllers').controller('FeedCtrl', function(
	$scope, $timeout, __config, ApiService, ArticlesService, DataSourceService, ComplexPropertyTools,
	ArrayTools, DateTools, FilterService) {
					
	$scope.filter = FilterService.filter;	

	/**
	 * Setup the filter.
	 * 
	 * Wait for the articles promise and sources promise to be resolved, then build the filter.
	 * Articles is inherited from page controller, but we must still wait for the promise to resolve.
	 */
	ArticlesService.getArticles().then(function() {
		DataSourceService.getSources().then( function(sourceData) {
			$scope.sources = FilterService.build(sourceData, $scope.articles);
			$scope.refreshFeed(); //Ensure the feed is filtered on first load
		}).catch( function(err) {
			console.log(err);
		});
	}).catch( function(err) {
		console.log(err);
	});

	
	/**
	 * When attached to a Bootstrap dropdown, remove the 'open' class after the cursor has left the dropdown for a specified period
	 * 
	 * @param {event} $event The onmouseout/onmouseleave event for the dropdown
	 * @param {int} delay The delay for close in ms; default 500ms
	 */
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
	
	/**
	 * Update the options that are visible in the filter based on other options that are selected.
	 * 
	 * @param {object} source The source that is currently being filtered by the user
	 * @param {object} filter The filter that is currently being adjusted by the user
	 */
	$scope.updateFilterOptions = function(source, filter)
	{
		$scope.sources = FilterService.updateOptions($scope.sources, source, $scope.articles, filter, $scope.attributes) || $scope.sources;
	}
	
	/**
	 * Refreshes the feed to reflect the current filter
	 */
	$scope.refreshFeed = function() {
		//Check for minimum required scope
		if(!$scope.articles)
			return;
		
		//Ensure the days back does not exceed filter bounds
		if(FilterService.filter.daysBack < 1)
			FilterService.filter.daysBack = 1;
		if(FilterService.filter.daysBack > __config.MAX_DAYS_BACK)
			FilterService.filter.daysBack = __config.MAX_DAYS_BACK;
		
		//Reset the count
		$scope.filter.count = 0;
		for(var i = 0; i < $scope.articles.length; i++)
		{	
			//Determine whether or not the article is shown
			$scope.articles[i].inFeed = FilterService.determineShow($scope.articles[i], $scope.sources, $scope.attributes);
			if($scope.articles[i].inFeed)
				$scope.filter.count++;//increment count if necessary
		}
		
		//Build the minimum number of cards required to activate a scroll
		//This is important to run every time the filter changes, just in case the filter eliminates all the built cards and
		//the user can no longer trigger an infinite scroll event (because they can't scroll)
		$scope.buildMoreCards(__config.MIN_RENDERED_CARDS);
	}
	
	//idk
	$scope.$watch('attributes[0].checked', function() {
		$scope.refreshFeed();
	});
			
	/**
	 * Remove an article from the feed given an id
	 * 
	 * @param {string} id  The id of the article to remove (represented by Conduit's standard article paramter article.id)
	 */
	$scope.remove = function (id) {
		//Get the index of the article
		index = ArrayTools.getIndex($scope.articles, id);
		
		//Update view properties
		$scope.articles[index].removed = true;
		$scope.articles[index].read = true;
		ApiService.update.articleStatus($scope.articles[index].id, undefined, undefined, true).then(function(res){});
		$scope.articles[index].inFeed = false;
		
		//Refresh view
		$scope.refreshFeed();
		$scope.activateCard();
	}
		
    /**
	 * Restore an article to the feed given an id
	 * 
	 * @param {string} id  The id of the article to restore (represented by Conduit's standard article paramter article.id)
	 */
	$scope.restore = function (id) {
		//Get the index of the article
		index = ArrayTools.getIndex($scope.articles, id);
		
		//Update the view properties
		$scope.articles[index].removed = false;
		$scope.articles[index].active = false;
		
		//Refresh view
		$scope.refreshFeed();
	}
			
	/**
	 * Add x number of cards to the DOM. This is necessary to reduce DOM events at load and reduce the page load time by >16 seconds.
	 * This is automatically called for a predetermined number of cards every time the user reaches the bottom of the FEED.
	 * All objects in the BOOK are built and destroyed on demand.
	 * 
	 * This function will add up to x cards to the DOM, only building them if they have not already been built but are currently supposed to be shown.
	 * If there are less than x cards that meet build criteria, then only those cards will be built.
	 * This function will also *reorder the articles array* so that articles are shown in the order they were built. This prevents the user from setting 
	 * and then removing a filter and causing an article to 'stick' to the bottom of the feed as they scroll.
	 * 
	 * @param {int} numCards The number of cards to build; default is __config.MIN_RENDERED_CARDS / 2
	 */
	$scope.buildMoreCards = function (numCards) {
		//Enforce minimums and set defaults
		if(!$scope.articles)
			return;
		if(!numCards)
			numCards = (__config.MIN_RENDERED_CARDS / 2);
		
		for(var i = 0; i < $scope.articles.length; i++)
			//Find the first article that should be shown, but hasn't been built yet
			if($scope.articles[i].inFeed && !$scope.articles[i].build)
			{
				//Iterate through numCards from there
				for(var j = i; j < i + numCards && j < $scope.articles.length; j++)
				{
					//If the article is not supposed to be in the feed, skip it and increment numCards to allow for an additional loop iteration
					//Remember: base case is 'j < i + numCards', so incrementing numCards pushes the base case up
					if(!$scope.articles[j].inFeed)
					{
						numCards++;
						continue;
					}
					//Flag the article for build on next digest cycle
					$scope.articles[j].build = true;

					//Rearrange the array so that the article appears right after the most recently built article
					for(var k = 0; k < $scope.articles.length; k++)
						if(!$scope.articles[k].build)
						{
							$scope.articles = ArrayTools.swap($scope.articles, j, k);
							break;
						}
				}
				break;
			}
	}
});