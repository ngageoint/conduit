angular.module('conduit.directives').directive('tags', function() {
		return {
			restrict: 'AE',
			replace: 'true',
			templateUrl: './templates/tags.html'
		};
	});