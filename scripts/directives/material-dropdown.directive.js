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
				list: "=miDdList"
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
					//updateLabel();
				}

				$scope.debug = function() {
					console.log(open);
				}
			}
		};
		/*
		var controller = ['$scope', function ($scope) {

			var dropdownToggle = jqLite($element[0].querySelector('.dropdown-toggle'))
			console.log(dropdownToggle);
			 var dropdownContainer = dropdownToggle.next()
			 console.log(dropdownContainer);
			var dropdownMenu = jqLite(dropdownContainer[0].querySelector('.dropdown-menu .inner'))
			console.log(dropdownMenu);
			dropdownMenu.on('click', function menuEventHandler (event) {
				console.log('clicked');
				if(isDisabled) {
				  return;
				}
				console.log('dropdown click');
				if(jqLite(event.target).hasClass('dropdown-header')) {
				  return;
				}
				var miDdOptionNode = filterTarget(event.target, dropdownMenu[0], 'mi-dd-option');
				var miDdOption;
	  
				if(miDdOptionNode !== null) {
					miDdOption = jqLite(miDdOptionNode);
				  if(miDdOption.hasClass('disabled')) {
					return;
				  }
				  selectOption(miDdOption);
				}
			  });

			var selectOption = function(option) {
				console.log(option);
				if(multi) {
					if(!Array.isArray($scope.model)) {
						$scope.model = [];
					}
					if($scope.model.length > 0) {
						for(let i = 0; i < $scope.model.length; i++) {
							if(angular.equals(option, $scope.model[i])) {
								$scope.model.splice(i, 1);
								return;
							}
						}
					}
					$scope.model.push(option);
				} else {
					$scope.model = option;
				}
			}
		}]*/
	});