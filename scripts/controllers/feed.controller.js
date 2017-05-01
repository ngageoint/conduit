angular.module('conduit.controllers').controller('FeedCtrl', function(
	$scope, $timeout, __config, ArticlesService, DataSourceService, ComplexPropertyTools, ArrayTools, DateTools) {
					
	$scope.filter = {};
	$scope.filter.MAX_DAYS_BACK = __config.MAX_DAYS_BACK;
	$scope.filter.DEFAULT_DAYS_BACK = __config.DEFAULT_DAYS_BACK;
	$scope.filter.daysBack = $scope.filter.DEFAULT_DAYS_BACK;	

	//Setup Filter
	//The filter needs the articles loaded to be built, so we wait from articles to load; no data is passed since we inherit articles
	ArticlesService.getArticles().then(function() {
		DataSourceService.getSources().then( function(sourceData) {
			$scope.sources = sourceData;
			
			$scope.filterCount = $scope.articles.length;
			
			//Populate our data sources filter attributes with values found in the articles
			for(var i = 0; i < $scope.articles.length; i++)
			{						
				for(var j = 0; j < $scope.sources.length; j++)
				{
					if(~$scope.articles[i].tags.indexOf($scope.sources[j].tag))
						for(var k = 0; k < $scope.sources[j].filter.length; k++)
							if($scope.sources[j].filter[k].binding.property)
							{
								var boundProp = ComplexPropertyTools.getComplexProperty($scope.articles[i], $scope.sources[j].filter[k].binding.property)
								if(boundProp)
								{
									for(var l = 0; l < boundProp.length; l++)
									{
										var value = {};
										if($scope.sources[j].filter[k].binding.data)
										{
											var boundData = ComplexPropertyTools.getComplexProperty(boundProp[l], $scope.sources[j].filter[k].binding.data)
											
											if(boundData)
												value.data = boundData.trim();
											else
												value.data = boundProp[l].trim();
										}
										else
											value.data = boundProp[l].trim();
										
										if($scope.sources[j].filter[k].binding.name)
										{
											var boundName = ComplexPropertyTools.getComplexProperty(boundProp[l], $scope.sources[j].filter[k].binding.name)
											
											if(boundName)
												value.name = boundName.trim();
											else
												value.name = value.data;
										}
										else
											value.name = value.data;
										//Values in the filter are JSON objects with the topic name and a field to track whether or not it is checked; this is bound to the dropdowns.
										value.checked = false;
										value.show = true;
										
										//Determine if the topic has already been included; if not, add it.
										var newValue = true;
										for(var m = 0; m < $scope.sources[j].filter[k].values.length; m++)
										{
											if(~$scope.sources[j].filter[k].values[m].data.indexOf(value['data']))
											{
												newValue = false;
												break;
											}
											else
												newValue = true;
										}
														
										if(newValue)
											$scope.sources[j].filter[k].values.push(value);
									}
								}
							}
				}
			}
					
			//Sort and cleanup
			for(var i = 0; i < $scope.sources.length; i++)
				for(var j = 0; j < $scope.sources[i].filter.length; j++)
				{
					$scope.sources[i].filter[j].values.sort(function(a, b){return a['data'].localeCompare(b['data'])});
					//Add a 'none' option to end of each topic list
					//$scope.sources[i].filter[j].values.push({data: "None", checked:false});	
				}
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
			//Identify which source we are working with					
			for(var s = 0; s < $scope.sources.length; s++)//
				if(~$scope.sources[s].name.indexOf(source))
				{
					source = s;
					break;	
				}
						
			var loneFilter = true; //flag whether or not the filter is operating on its own, or in conjunction with others
			
			//Identify which filter we are working with
			for(var f = 0; f < $scope.sources[s].filter.length; f++)
			{
				if(~$scope.sources[source].filter[f].name.indexOf(filter))
					filter = f;
				//If we're looking at a filter that has selected values, and it's not the filter we want to be looking at, set the loneFilter flag to false
				if(filter != f && ($scope.sources[source].filter[f].selectedValues && $scope.sources[source].filter[f].selectedValues.length > 0))
					loneFilter = false;						
			}
					
			//Set all the filter values equal to the loneFilter; show all if the filter is operating on its own, or hide all if the filter is working with other filters
			for(var v = 0; v < $scope.sources[source].filter[filter].values.length; v++)
				$scope.sources[source].filter[filter].values[v].show = loneFilter;
				

			//If it's a lone filter, we can return now since all we're doing is showing everything
			if(loneFilter)
			{
				/*Attempt to add days to filter of filter
				for(var p = 0; p < $scope.articles.length; p++)
					//If the article is currently being shown...
					if(DateTools.isNewerThan($scope.articles[p].date, $scope.filter.daysBack))
						for(var pv = 0; pv < boundProp.length; pv++)
							for(var fv = 0; fv < $scope.sources[source].filter[filter].values.length; fv++)
								if(~boundProp[pv].indexOf($scope.sources[source].filter[filter].values[fv].data))	
										$scope.sources[source].filter[filter].values[fv].show = true;
				*/
				return;
			}
								
			var temp = $scope.sources[source].filter[filter].selectedValues;
			$scope.sources[source].filter[filter].selectedValues = '';
						
			//Go through all of the articles
			for(var p = 0; p < $scope.articles.length; p++)
				//If the article is currently being shown...
				if(determineShow($scope.articles[p], $scope.sources))
				{
					//...then run through the bound values in the article and compare them to the values in the filter 
					var boundProp = ComplexPropertyTools.getComplexProperty($scope.articles[p], $scope.sources[source].filter[filter].binding.property)
					for(var pv = 0; pv < boundProp.length; pv++)
					{
						var boundData = boundProp[pv];
						if($scope.sources[source].filter[filter].binding.data)
							boundData = ComplexPropertyTools.getComplexProperty(boundProp[pv], $scope.sources[source].filter[filter].binding.data);
						for(var fv = 0; fv < $scope.sources[source].filter[filter].values.length; fv++)
							//If our visible article has bound data that matches the filter, then we'll go ahead and show that filter value
							if(~boundData.indexOf($scope.sources[source].filter[filter].values[fv].data))	
								$scope.sources[source].filter[filter].values[fv].show = true
					}
				}
				
    		$scope.sources[source].filter[filter].selectedValues = temp;
	}
			
	$scope.refreshFilter = function() {
		if(!$scope.articles)
			return;
			
		if($scope.filter.daysBack < 1)
			$scope.filter.daysBack = 1;
		if($scope.filter.daysBack > __config.MAX_DAYS_BACK)
			$scope.filter.daysBack = __config.MAX_DAYS_BACK;
			
		$scope.filterCount = 0;
		for(var i = 0; i < $scope.articles.length; i++)
		{
			$scope.articles[i].inFeed = determineShow($scope.articles[i], $scope.sources);
			if($scope.articles[i].inFeed)
				$scope.filterCount++;
		}
				
		$scope.buildMoreCards(__config.MIN_RENDERED_CARDS);
	}
			
	$scope.$watch('attributes[0].checked', function() {
		$scope.refreshFilter();
	});
			
	//Filter Function
	determineShow = function(article, sources)
	{	
		if(!sources)
			return true;
		
		if(!DateTools.isNewerThan(article.date, $scope.filter.daysBack))
			return false;
				
		//Filter trash first because it is the cheapest calculation
		if(!$scope.cbxTrash && article.removed)
			return false;
		if($scope.cbxTrash && !article.removed)
			return false;
		if($scope.cbxTrash && article.removed)
			return true;
					
		//Filter by source second because it can cheaply eliminate many articles
    	var srcChecked = false;
		for(var i = 0; i < sources.length; i++)
			if(sources[i] && sources[i].checked && ~article.source.indexOf(sources[i].name))
				srcChecked = true;
		if(!srcChecked)
			return false;	
		
		for(var i = 0; i < $scope.attributes.length; i++)
			if($scope.attributes[i] && $scope.attributes[i].checked)
				if(article[$scope.attributes[i].compare])
				{
					if((typeof(article[$scope.attributes[i].compare]) === "boolean") && !article[$scope.attributes[i].compare])
						return false;
					if(article[$scope.attributes[i].compare].constructor === Array && article[$scope.attributes[i].compare].length < 1)
						return false;
				}
				
		//Find out if a source has been selected, but no filter has been applied; show all from that source if true
		//For all of the sources
		for(var s = 0; s < sources.length; s++)
		{	
			//If the source is not checked or this article is not from this source, it doesn't matter so move on
			if(sources[s] && !sources[s].checked || !~article.source.indexOf(sources[s].name))
				continue;
			//If this source is checked AND this article is from the sources
			if(sources[s] && sources[s].checked && ~article.source.indexOf(sources[s].name))
			{
				//Then look through all of the filters of the source
	    		for(var f = 0; f < sources[s].filter.length; f++)
    			{
					//If one of the filters is checked, then we can't use this shortcut for this filter, so break;
					if(sources[s] && sources[s].filter[f].selectedValues && sources[s].filter[f].selectedValues.length != 0)
						break;
					//If we've made it this far and exhausted all of the possible filters for this source, return true because the article will be shown
					if(sources[s] && f == sources[s].filter.length - 1)
						return true;
				}
			}
		}

		//And now we get to the complicated stuff...
		//For every source
		var globalMatch = true;
		for(var s = 0; s < sources.length && globalMatch; s++)
		{
			if(!~article.source.indexOf(sources[s].name))
					continue;
			//And every filter of every source
    		for(var f = 0; f < sources[s].filter.length && globalMatch; f++)
			{
				//If the selected values are null or empty, try the next source because nothing else needs to be done in this iteration
				if(!sources[s].filter[f].selectedValues || (sources[s].filter[f].selectedValues && sources[s].filter[f].selectedValues.length <= 0))
					continue;
						
				var hasMatch = false;//A match was found between the filter and the article binding
				
				//For all of the article binding elements, as long as we haven't found a match yet
				var boundProp = ComplexPropertyTools.getComplexProperty(article, sources[s].filter[f].binding.property)
				
				for(var p = 0; p < boundProp.length && !hasMatch; p++)
				{
					var boundData = boundProp[p];
					if(sources[s].filter[f].binding.data)
						boundData = ComplexPropertyTools.getComplexProperty(boundProp[p], sources[s].filter[f].binding.data);
					if(boundData)
						for(var v = 0; v < sources[s].filter[f].selectedValues.length && !hasMatch; v++)
							if(sources[s].filter[f].selectedValues[v] && ~boundData.indexOf(sources[s].filter[f].selectedValues[v]))
								hasMatch = true;
				}
				if(!hasMatch)
					globalMatch = false;
			}
		}
		if(!globalMatch)
			return false;

		return true;
	}
			
	//Remove feature
	$scope.remove = function (id) {
		
		index = ArrayTools.getIndex($scope.articles, id);
		
		$scope.articles[index].removed = true;
		$scope.articles[index].read = true;
		$scope.articles[index].inFeed = false;
		
		$scope.refreshFilter();
		$scope.activateCard();
	}
		
    //Restore feature
	$scope.restore = function (id) {
				
		index = ArrayTools.getIndex($scope.articles, id);
		
		$scope.articles[index].removed = false;
		$scope.articles[index].active = false;
		
		$scope.refreshFilter();
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