/**
 * This directive loads a card as an HTML element using the card template
 * 
 * <card></card>
 */

angular.module('conduit.directives').directive('materialDropdown', function($compile) {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl: './templates/material-dropdown.html',
			controller: controller,
			transclude: true,
			scope: {
				model: '=ngModel',
				label: '@miDdLabel',
				labelItems: '=miDdLabelItems',
				list: '=miDdList',
				search: '&miDdSearch',
				multi: '&miDdMuliselect'
			},
			link: function($scope, elem, attr, ctrl) {

				/*$scope.showMsg = false;
				$scope.msg = '';
				$scope.error = false;

				$scope.$watch('model', function() {
					//checkForErrors();
					//updateMsg();
				});*/
			}
		};

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
		}]
	});