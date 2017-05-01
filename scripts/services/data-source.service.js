/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('DataSourceService', function($http) { 
	var sources = $http.get('data/sources.json').then(function(response) {
			return response.data;
		});
	
	var getSources = function() {
		return sources;
	};
	
	return {
	  getSources: getSources
	};
});