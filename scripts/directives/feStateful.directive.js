/**
 * Fluid Element. One of two directives to make an element have fluid height within a container of unknown height. This element will exist in 'states' of height (even if dynamically set) that will
 * cause the feFluid element to adjust height to fill the remaining space.
 * 
 * <fe-stateful></fe-stateful>
 * or
 * <div class="fe-stateful"></div>
 */
angular.module('conduit.directives').directive('feStateful', function() {
		return {
			restrict: 'EC',
			link: function (scope, element, attrs) {
				
				scope.$watch(function() {
					scope.__height = element[0].offsetHeight;	
				});

			}
		};
	});