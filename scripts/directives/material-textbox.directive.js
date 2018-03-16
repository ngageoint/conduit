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
				duplicatesKey: '@',
				boundError: '&error',
			},
			link: function($scope, elem, attr, ctrl) {

				$scope.showMsg = false;
				$scope.msg = '';
				$scope.error = false;

				var checkForErrors = function() {
					$scope.showMsg = false;
					$scope.error = false;

					if(typeof $scope.characterLimit !== 'undefined' && $scope.model.length > $scope.characterLimit) {
						$scope.error = true;
						return;
					}
					if(typeof $scope.noDuplicatesOn !== 'undefined' && $scope.model.length > 0) {
						
						var filter = undefined;
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
							$scope.msg = 'That value already exists';
							$scope.error = true;
							return;
						}
					}
					if(typeof $scope.boundError === 'function') {
						$scope.error = $scope.boundError();
						return;
					} else if (typeof $scope.boundError === 'boolean') {
						$scope.error = $scope.boundError;
						return;
					}
					$scope.error = false;
				}

				var updateMsg = function() {
					if($scope.error) {
						$scope.showMsg = true;
					} else if (typeof $scope.model !== 'undefined' && $scope.model.length > $scope.characterLimit * .75) {
						$scope.msg = $scope.model.length + '/' + $scope.characterLimit;
						$scope.showMsg = true;
					} else {
						$scope.showMsg = false;
					}
					

				}

				$scope.$watch('model', function() {
					checkForErrors();
					updateMsg();
				});
			}
		};
	});