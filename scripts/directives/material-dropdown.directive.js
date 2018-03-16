/**
 * This directive loads a card as an HTML element using the card template
 * 
 * <card></card>
 */

angular.module('conduit.directives').directive('materialDropdown', function($compile, ArrayTools) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl: './templates/material-dropdown.html',
			scope: {
				model: '=ngModel',
				label: '@miDdLabel',
				list: '=miDdList',
				search: '&miDdSearch',
				multi: '&miDdMuliselect',
				onUpdate: "&miDdOnUpdate",
				onItemClick: "&miDdOnItemClick"
			},
			link: function($scope, elem, attr, ctrl) {
				
				if(typeof $scope.model === 'undefined') {
					$scope.model = [];
				}
				const defaultLabel = $scope.label || '';
				

				var updateLabel = function() {
					if($scope.model.length < 1) {
						$scope.label = defaultLabel;
					} else if ($scope.model.length == 1) {
						$scope.label = $scope.model[0];
					} else if ($scope.model.length == 2) {
						$scope.label = $scope.model[0] + ', ' + $scope.model[1];
					} else {
						$scope.label = $scope.model.length + ' selected'
					}
				}

				$scope.itemSelected = function(item) {
					
					let data = item;
					if(typeof item.data !== 'undefined') {
						data = item.data;
					}
					let index = $scope.model.indexOf(data);
					if(index !== -1) {
						$scope.model = ArrayTools.removeElement($scope.model, index);
						item.selected = false;
					} else {
						$scope.model.push(data);
						item.selected = true;
					}
					if(typeof $scope.onItemClick === 'function') {
						$scope.onItemClick();
					}
					updateLabel();
				}
				if(typeof $scope.onUpdate === 'function') {
					$scope.$watch('model', $scope.onUpdate, true);
				}
			}
		};
	});