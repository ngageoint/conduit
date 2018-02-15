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
				label: '@',
				noDuplicatesOn: '=',
				duplicatesKey: '@'
			},
			link: function($scope, elem, attr, ctrl) {
				$scope.showMsg = (typeof $scope.characterLimit !== 'undefined') || (typeof $scope.noDuplicatesOn !== 'undefined');
				$scope.error = function() {
					$scope.showMsg = false;
					if(typeof $scope.characterLimit !== 'undefined' && $scope.model.length > $scope.characterLimit * .75) {
						$scope.showMsg = true;
						$scope.msg = $scope.model.length + '/' + $scope.characterLimit;
						if($scope.model.length > $scope.characterLimit) {
							return true;
						}
					}
					if(typeof $scope.noDuplicatesOn !== 'undefined' && $scope.model.length > 0) {
						
						let filter = undefined;
						if(typeof $scope.duplicatesKey !== 'undefined') {
							filter = function (el) {
										return (el[$scope.duplicatesKey] === $scope.model);
							}
						} else {
							filter = function (el) {
								return (el === $scope.model);
							}
						}
						if($scope.noDuplicatesOn.filter(filter).length > 0) {
							$scope.showMsg = true;
							$scope.msg = 'That value already exists';
							return true;
						}
						return false;
					}
				}
			}
		};
	});