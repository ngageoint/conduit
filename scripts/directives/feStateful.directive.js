angular.module('conduit.directives').directive('feStateful', function() {
		return {
			restrict: 'E',
			link: function (scope, element, attrs) {
				
				scope.$watch(function() {
					scope.__height = element[0].offsetHeight;	
				});

			}
		};
	});