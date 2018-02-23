angular.module('conduit.directives').directive('miDdOption', function($compile) {
		return {
			restrict: 'E',
			require: 'materialDropdown',
			replace: 'true',
			link: function($scope, elem, attr, parentCtrl) {

			}
		};

		var controller = ['$scope', function ($scope) {

			function init() {
				$scope.items = angular.copy($scope.datasource);
			}
  
			init();
  
			$scope.addItem = function () {
				$scope.add();
  
				//Add new customer to directive scope
				$scope.items.push({
					name: 'New Directive Controller Item'
				});
			};
		}]
	});