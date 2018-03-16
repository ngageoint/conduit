/**
 * Elements with this attribute will scroll to the top when the passed variable is changed
 * 
 * <div data-scroll-to-top="selectedIndex"></div>
 */
angular.module('conduit.directives').directive('scrollCenterOn', function() {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
			scope.$watch(attrs.scrollCenterOn, function(newVal, oldVal) {
				
			});
		}
	};
});