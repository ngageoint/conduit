// JavaScript Document

var config = {}
if(window) {
	
	if (typeof Object.assign != 'function') {
		
		/*Polyfill to support IE*/
		Object.assign = function(target) {
			
			'use strict';
			if (target == null) {
		  		throw new TypeError('Cannot convert undefined or null to object');
			}
	
			target = Object(target);
			
			for (var index = 1; index < arguments.length; index++)
		  		var source = arguments[index];
				if (source != null)
					for (var key in source)
			  			if (Object.prototype.hasOwnProperty.call(source, key))
							target[key] = source[key];
			return target;
	  	};
	}
	
	Object.assign(config, window.__config);
}

//App and bootstrap setup
	var pageApp = angular.module('pageApp', ['xeditable', 'ui.bootstrap','nya.bootstrap.select', 'angular-loading-bar', 'ngAnimate', 'infinite-scroll', 'tw.directives.clickOutside', 'cfp.loadingBar']);
	pageApp.constant('__config', config);
	//Put a 10ms delay per card rendered in an infinite scroll event (which is MIN_RENDERED_CARDS / 2)
	angular.module('infinite-scroll').value("THROTTLE_MILLISECONDS", (__config.MIN_RENDERED_CARDS / 2) * 10);
	
	pageApp.run(function(editableOptions, editableThemes) {
		// set `default` theme for xedit
		editableOptions.theme = 'bs3';
	});
	
/*/////////////////////
//////CONTROLLERS//////
/////////////////////*/
	
//-------------------------//
//----usernameModalCtrl----//
//-------------------------//
							 
	/*	Ctrl for the username modal */
	pageApp.controller('usernameModalCtrl', function ($scope, $uibModal, $log, $document) {
		
		var $ctrl = this;
		
		$ctrl.user = '';
		
		$ctrl.open = function(size, parentSelector) {
			var parentElem = parentSelector ?
				angular.element($document[0].querySelector('.username-modal ' + parentSelector)) : undefined;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/modal-username.html',
				controller: 'usernameModalInstanceCtrl',
				controllerAs: '$ctrl',
				size: size,
				scope: $scope,
				appendTo: parentElem,
				resolve: {
					user: function() {
						return $ctrl.user;	
					}
				}
			});
			
			modalInstance.result.then(function (user) {
				$scope.setUserInfo(user);
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		}		
	});
	//TODO
	pageApp.controller('usernameModalInstanceCtrl', function ($uibModalInstance, user) {
		var $ctrl = this;
		$ctrl.name = user.name;
		$ctrl.user = {
			name: $ctrl.name,
		};
			
		$ctrl.ok = function () {
			$uibModalInstance.close($ctrl.user);	
		}
		
		$ctrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}
	});
	
//-----------------//
//----betaCtrl----//
//-----------------//
							 
	/*	Ctrl used for certain beta features that will not be present in full release */
	pageApp.controller('betaCtrl', function ($scope, $rootScope, $http, ArticlesService, cfpLoadingBar) {
		
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
	
//-----------------//
//----cardsCtrl----//
//-----------------//
											 
	/*	The controller assigned to all article cards throughout the application */
	pageApp.controller('cardsCtrl', function ($scope, $filter, ArticlesService, AttributesService, BooksService) {
		
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
		
		$scope.formatDate = function(date) {
			
			if(typeof date === 'string')
				date = new Date(date);
			
			return $filter('date')(date, 'dd MMMM yyyy')	
		}
		
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
					index = getIndex($scope.articles, id);
				
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
	
//----------------//		
//----feedCtrl----//
//----------------//	

	/* The controller used to bind ArticlesService data to the ArticleStream element*/
	pageApp.controller('feedCtrl', function($scope, $timeout, __config, ArticlesService, DataSourceService) {
					
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
										var boundProp = getComplexProperty($scope.articles[i], $scope.sources[j].filter[k].binding.property)
										if(boundProp)
										{
											for(var l = 0; l < boundProp.length; l++)
											{
												var value = {};
												if($scope.sources[j].filter[k].binding.data)
												{
													var boundData = getComplexProperty(boundProp[l], $scope.sources[j].filter[k].binding.data)
													
													if(boundData)
														value.data = boundData.trim();
													else
														value.data = boundProp[l].trim();
												}
												else
													value.data = boundProp[l].trim();
													
												if($scope.sources[j].filter[k].binding.name)
												{
													var boundName = getComplexProperty(boundProp[l], $scope.sources[j].filter[k].binding.name)
													
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
							if(isNewerThan($scope.articles[p].date, $scope.filter.daysBack))
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
							var boundProp = getComplexProperty($scope.articles[p], $scope.sources[source].filter[filter].binding.property)
							for(var pv = 0; pv < boundProp.length; pv++)
							{
								var boundData = boundProp[pv];
								if($scope.sources[source].filter[filter].binding.data)
									boundData = getComplexProperty(boundProp[pv], $scope.sources[source].filter[filter].binding.data);
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
				
				if(!isNewerThan(article.date, $scope.filter.daysBack))
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
						var boundProp = getComplexProperty(article, sources[s].filter[f].binding.property)
						
						for(var p = 0; p < boundProp.length && !hasMatch; p++)
						{
							var boundData = boundProp[p];
							if(sources[s].filter[f].binding.data)
								boundData = getComplexProperty(boundProp[p], sources[s].filter[f].binding.data);
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
				
				index = getIndex($scope.articles, id);
				
				$scope.articles[index].removed = true;
				$scope.articles[index].read = true;
				$scope.articles[index].inFeed = false;
				
				$scope.refreshFilter();
				$scope.activateCard();
			}
		
		//Restore feature
			$scope.restore = function (id) {
				
				index = getIndex($scope.articles, id);
				
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
	
//----------------//
//----bookCtrl----//
//----------------//
	
	/* The controller used to bind ArticleBookService data to the ArticleBook element*/
	pageApp.controller('bookCtrl', function($scope, $rootScope, BooksService) {
		
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
				
				index = getIndex($scope.articles, id);
				
				$scope.articles[index].inBook = false;
				$scope.articles[index].activeInBook = false;
				
				for(var i = 0; i < $scope.articles[index].books.length; i++)
					if(~$scope.articles[index].books[i].name.indexOf($scope.selectedBook.name))
						$scope.articles[index].books = removeElement($scope.articles[index].books, i);

				$scope.updateBook();
				$scope.activateCard('Feed', id);
			}	
	});
	
//-------------------//
//----displayCtrl----//
//-------------------//
	
	/* The controller assigned to the ArticleView element */
	pageApp.controller('displayCtrl', function($q, $scope, $rootScope, $timeout, __config) {
		
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
//------------------//
//----exportCtrl----//
//------------------//
	
	/* The controller assigned to the Export elements */
	pageApp.controller('exportCtrl', function($q, $scope) {
		
		/*Retruns a promise of a docx file*/
		var createFile = function(article) {			
			return new Promise(function(resolve, reject){
				
				function loadImg(src, callback) {
					myimg = new Image();
					myimg.onload = callback;
					myimg.src = src;
				}
				
				loadImg('example.jpg', function() {
					createDoc();
				});
					
				createDoc = function() {
				
					var opts = {}
					opts.centered = false;
					opts.getImage=function(tagValue, tagName) {
						return getBase64Image(myimg);
					}
				
					opts.getSize=function(img,tagValue, tagName) {  
						return [200,200];
					}
				
					var imageModule=new window.ImageModule(opts);
					
					var loadFile=function(url,callback){
						JSZipUtils.getBinaryContent(url,callback);
					}
					loadFile("templates/export-tplt.docx",function(err,content){
						if (err) { throw e};
						doc=new Docxgen(content);
						
						doc.attachModule(imageModule);
						doc.setData( {
							"title":article.title,
							"text":ooxmlP(article.text),
							"date": $scope.formatDate(new Date()),
							"image":"example.jpg"
						}); //set the templateVariables
						doc.render() //apply them
						out=doc.getZip().generate({type:"blob"}) //Output the document using Data-URI
						
						if(out)
							resolve(out);
						else
							reject();
						
						return Promise.resolve(doc);
					})
				}
			})
		}
		
		function getBase64Image(img) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
		
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
		
			var dataURL = canvas.toDataURL("image/png");
			return dataURL.replace('data:image/png;base64,', "");
		}
		
		$scope.export = function(article) {
			createFile(article).then(function(doc) {
				saveFile(getFirstChars(article.title, 75).replace('\\','-').replace('/','-'), doc, '.docx');
			});	
		}
		
		
		
		
		/*
		var myimg;
		
		function loadImg(src, callback) {
			myimg = new Image();
			myimg.onload = callback;
			myimg.src = src;
		}
		
		function Start() {
			loadImg('templates/logo-mark.png', function() {
				createDoc();
			});
		}
		
		function createDoc() {
			var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
				return getBase64Image(myimg);
			}
		
			opts.getSize=function(img,tagValue, tagName) {  
				return [200,200];
			}
		
			var imageModule=new window.ImageModule(opts);
		
			var loadFile=function(url,callback){
				JSZipUtils.getBinaryContent(url,callback);
			}
		
			loadFile("templates/test2.docx",function(err,content){
				if (err) { throw e};
				doc=new Docxgen(content);
				doc.attachModule(imageModule);
				doc.setData( {"first_name":"Hipp",
					"last_name":"Edgar",
					"phone":"0652455478",
					"description":"New Website",
					"myimage":"templates/logo-mark.png"
					}
				);
				doc.render() ;
				out=doc.getZip().generate({type:"blob"});
				saveAs(out,"output.docx");
			});
		}
		
		function getBase64Image(img) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
		
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
		
			var dataURL = canvas.toDataURL("image/png");
			return dataURL.replace('data:image/png;base64,', "");
		}
		*/
		$scope.exportBook = function() {
			
			var createZip = function(zip) {
				if(JSZip.support.blob)
					zip.generateAsync({type : "blob"}).then(function(blob) {
						saveFile($scope.selectedBook.name + ' ' + $scope.formatDate(new Date()), blob, '.zip')
					});
			}
						
			var loadAllFiles = function() {
					
					var promises = [];
					var promiseNames = [];//Not the best way to do this, but it'll work for now
					
					if($scope.selectedBook && $scope.articles)				
						for(var i = 0; i < $scope.articles.length - 1; i++)
							for(var j = 0; j < $scope.articles[i].books.length; j++)						
								if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.selectedBook.name))
								{
									promises.push(createFile($scope.articles[i]));
									promiseNames.push(getFirstChars($scope.articles[i].title, 75).replace('\\','-').replace('/','-'));	
								}
					
					
					return $q.all(promises)
						.then(function(results) {
							for(var i = 0; i < results.length; i++)
								zip.file(promiseNames[i] + ".docx", results[i]);
							return zip;
						});
			}
			
			var zip = new JSZip();
			
			loadAllFiles().then(function(zip) {
				createZip(zip);	
			});

		}
		
		var saveFile = function(name, file, ext) {
			saveAs(file, name + ext);
		}
		
		var getFirstChars = function(str, numChars)
		{
			if(!numChars)
				numChars = 50;
			
			return (str ? 
						((str.length > numChars) ?
							str.substring(0, numChars) : 
							str) :
						'');
		}
	});
	
/*//////////////////////////
//////GLOBAL FUNCTIONS//////
//////////////////////////*/
		
		//Remove an element from a given array at a given index
		removeElement = function(array, index) {
			if(index < array.length && index >= 0)
				array.splice(index, 1);
			return array;
		};
		
		//Move an element in a given array from its current given index to a new given index
		moveElement = function(array, crtIndex, newIndex) {
			if(crtIndex < array.length && newIndex < array.length && crtIndex >= 0 && newIndex >= 0)
				array.splice(newIndex, 0, array.splice(crtIndex, 1)[0]);
		};
		
		moveToEnd = function(array, i)
		{
			return swap(array, i, array.length - 1);	
		}
		
		getIndex = function(array, id)
		{
			for(var i = 0; i < array.length; i++)
				if(~array[i].id.indexOf(id))
					return i;
		}
		
		swap = function(array, a, b){
				var temp = array[a];
				array[a] = array[b];
				array[b] = temp;
				
				return array;
			}
		
		isNewerThan = function(pubDate, numDays)
		{
			if(typeof pubDate === 'string')
				pubDate = new Date(pubDate);
			
			if(!numDays)
				numDays = __config.MAX_DAYS_BACK;
							
			var d = new Date();
			
			return (pubDate >= (d.setDate(d.getDate() - numDays)));
		};
	
		ooxmlP = function(paragraph)
		{
			var prefix = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:kinsoku w:val="0"/><w:overflowPunct w:val="0"/><w:spacing w:before="0"/><w:ind w:left="0" w:right="90"/></w:pPr><w:r><w:t>';
			var postfix = '</w:t></w:r></w:p>';
			var newline = '<w:br/>';
			
			return prefix + paragraph.replace(/[\n\r]/g, newline) + postfix;
		}
		
		getComplexProperty = function(obj, prop, delimiter)
		{
			if(typeof obj === 'undefined')
				return false;
			if(typeof delimiter === 'undefined')
				delimiter = '.';
			
			var _index = prop.indexOf(delimiter);
			if(_index > -1)
				return getComplexProperty(obj[prop.substring(0, _index)], prop.substr(_index + 1), delimiter)
			return obj[prop];
		}
		
/*/////////////////////////
//////GLOBAL SERVICES//////
/////////////////////////*/
		
		/* The ArticlesService makes all of the articles available in a global, editable promise. */
		pageApp.factory('ArticlesService', function($q, $http, __config) { 
			var articles = $q.all([	$http.get(__config.articlesUrl)
											.then(function(response) {
												return response.data;
											})
					])
					.then(function(results) {
						return results[0];
					});
			
			
			var getArticles = function() {
				return articles;
			};
			
			return {
			  getArticles: getArticles
			};		
		});
		
		/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
		pageApp.factory('BooksService', function($http) { 
			var books = $http.get('data/books.json').then(function(response) {
					//console.log(response.data);
					return response.data;
				});
			
			var getBooks = function() {
				return books;
			};
			
			return {
			  getBooks: getBooks
			};
		});
		
		/* The AttributesService makes all of the attributes available in a global, editable promise. */
		pageApp.factory('AttributesService', function($http) { 
			var attributes = $http.get('data/attributes.json').then(function(response) {
					//console.log(response.data);
					return response.data;
				});
			
			var getAttributes = function() {
				return attributes;
			};
			
			return {
			  getAttributes: getAttributes
			};
		});
		
		/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
		pageApp.factory('DataSourceService', function($http) { 
			var sources = $http.get('data/sources.json').then(function(response) {
					//console.log(response.data);
					return response.data;
				});
			
			var getSources = function() {
				return sources;
			};
			
			return {
			  getSources: getSources
			};
		});
	
/*////////////////////
//////DIRECTIVES//////
////////////////////*/
	
	/* Creates a list of tags, given an array; does NOT create image tags */
	pageApp.directive('tags', function() {
		return {
			restrict: 'AE',
			replace: 'true',
			templateUrl: 'templates/tags.html'
		};
	});
	
	/* Creates article cards */
	pageApp.directive('articleCard', function() {
		return {
			restrict: 'AE',
			replace: 'true',
			templateUrl: 'templates/article-card.html'
		};
	});
	
	/* Creates article cards */
	pageApp.directive('addTo', function() {
		return {
			restrict: 'AE',
			replace: 'true',
			templateUrl: 'templates/add-to.html'
		};
	});
	
	pageApp.directive('scrollToTop', function() {
		return {
			restrict: 'A',
			link: function indexChanged(scope, elem, attrs) {
				scope.$watch(attrs.scrollToTop, function() {
					elem[0].scrollTop = 0;
				});
			}
		};
	});
	
	/* Creates a list of tags, given an array; does NOT create image tags */
	pageApp.directive('fileOnChange', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var onChangeHandler = scope.$eval(attrs.fileOnChange);
				element.bind('change', function(event)  {
					var files = event.target.files;
					onChangeHandler(files);
				});
				
				element.bind('click', function() {
					element.val('');
				});
			}
			
		};
	});
	
	/*Fluid element child container with states*/
	pageApp.directive('feStateful', function() {
		return {
			restrict: 'E',
			link: function (scope, element, attrs) {
				
				scope.$watch(function() {
					scope.__height = element[0].offsetHeight;	
				});

			}
		};
	});
	
	/*Fluid element child container that fills remaining space dynamically*/
	pageApp.directive('feFluid', function() {
	
		return {
			restrict: 'EC',
			link: function (scope, element, attrs) {
				
				scope.$watch('__height', function(newHeight, oldHeight) {
					element[0].style.marginTop = (newHeight - 10) + 'px';
				});
				
			}
		};
	});