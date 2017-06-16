angular.module('conduit.directives').directive('feFluid', function() {
	
		return {
			restrict: 'EC',
			link: function (scope, element, attrs) {
				
				scope.$watch('__height', function(newHeight, oldHeight) {
					element[0].style.marginTop = (newHeight) + 'px';
				});				
			}
		};
	});