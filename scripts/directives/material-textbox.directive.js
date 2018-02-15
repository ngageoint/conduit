/**
 * This directive loads a card as an HTML element using the card template
 * 
 * <card></card>
 */

angular.module('conduit.directives').directive('materialTextbox', function($compile) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl: './templates/material-textbox.html',
			scope: {
				model: '=ngModel',
				characterLimit: '=',
				label: '='
			},
			link: function($scope, elem, attr, ctrl) {
				$scope.showCounter = (typeof $scope.characterLimit !== 'undefined')
				if($scope.showCounter) {
					$scope.showCounterAt = $scope.characterLimit * .75;
				}
			}
		};
	});