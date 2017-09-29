/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('ApiService', function($http, $location) { 

	const host = $location.host;
	
	return {
	  getSources: getSources
	};
});