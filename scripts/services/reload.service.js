/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
angular.module('conduit.services').factory('Reload', function($http, UserService) { 
	
	var reload = false;
	
	var setEnabled = function(enabled) {
		reload = enabled;
	}

	var enabled = function() {
		return reload;
	}
	
	return {
		setEnabled: setEnabled,
		enabled: enabled
	};
});