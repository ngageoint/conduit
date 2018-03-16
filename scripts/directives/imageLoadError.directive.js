angular.module('conduit.directives').directive('imageLoadError', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
		
				scope.inErrorState = false;
				scope.lastKnownUrl = '';
				scope.reloadMsg = 'Click to reload image';

				scope.forceReload = function() {
					scope.lastKnownUrl = scope.articles[scope.currentIndex].images[scope.articles[scope.currentIndex].selectedImage];
					scope.reloadMsg = 'Loading...'

					scope.articles[scope.currentIndex].images[scope.articles[scope.currentIndex].selectedImage] += 'dts=' + new Date().getTime();
					$timeout(function() {
						scope.reloadMsg = 'Click to reload image';
					}, 1500);
				}

				element.on('error', function() {
					scope.$apply(function() {
						scope.inErrorState = true;
					});
				});

				element.on('load', function() {
					scope.$apply(function() {
						scope.inErrorState = false;
					})
				})
			}
		};
	});