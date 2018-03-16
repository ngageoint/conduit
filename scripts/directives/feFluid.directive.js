/**
 * Fluid Element. One of two directives to make an element have fluid height within a container of unknown height. 
 * This element will adjust to fill space not used by an "feStateful" element
 * 
 * <fe-fluid></fe-fluid>
 * or
 * <div class="fe-fluid"></div>
 */
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