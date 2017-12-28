/**
 * Elements with this attribute will scroll to the top when the passed variable is changed
 * 
 * <div data-scroll-to-top="selectedIndex"></div>
 */
angular.module('conduit.directives').directive('scrollCenterOn', function() {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				console.log('scroll center on created, default ' + attrs.scrollCenterOn)
				scope.$watch(attrs.scrollCenterOn, function(newVal, oldVal) {
					console.log(newVal);
					if(newVal) {
						let parent = elem.parent()[0];
						console.log(parent.scrollTop);
						console.log(elem[0].offsetTop);

						let scrollTop = elem[0].offsetTop;

						console.log(parent.scrollTop);
					}
				});
			}
		};
	});