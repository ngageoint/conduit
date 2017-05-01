angular.module('conduit.directives').directive('card', function() {
		return {
			restrict: 'AE',
			replace: 'true',
			templateUrl: './templates/card.html'
		};
	});