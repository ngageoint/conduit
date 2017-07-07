/**
 * This directive loads a card as an HTML element using the card template
 * 
 * <card></card>
 */

angular.module('conduit.directives').directive('card', function() {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl: './templates/card.html'
		};
	});