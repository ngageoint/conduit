/* The AttributesService makes all of the attributes available in a global, editable promise. */
angular.module('conduit.services').factory('AttributesService', function($http) { 
	var attributes = $http.get('select/attributes').then(function(response) {
			return response.data;
	});
	
    var getAttributes = function() {
	    return attributes;
	};
	
	return {
	  getAttributes: getAttributes
	};
});