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