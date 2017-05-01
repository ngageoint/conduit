angular.module('conduit.tools').factory('ComplexPropertyTools', function($q, $http, __config) { 
	return {
        getComplexProperty: function(obj, prop, delimiter) {
			if(typeof obj === 'undefined')
				return false;
			if(typeof delimiter === 'undefined')
				delimiter = '.';
			
			var _index = prop.indexOf(delimiter);
			if(_index > -1)
				return getComplexProperty(obj[prop.substring(0, _index)], prop.substr(_index + 1), delimiter)
			return obj[prop];
		}
    };		
});