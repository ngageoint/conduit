/**
 * Elements with this attribute will scroll to the top when the passed variable is changed
 * 
 * <div data-scroll-to-top="selectedIndex"></div>
 */
angular.module('conduit.directives').directive('scrollToTop', function() {
		return {
			restrict: 'A',
			link: function indexChanged(scope, elem, attrs) {
				scope.$watch(attrs.scrollToTop, function() {
					elem[0].scrollTop = 0;
				});
			}
		};
	});