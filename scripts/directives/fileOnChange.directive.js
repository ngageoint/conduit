/**
 * This module attaches to an HTML input of type file and will ensure that a *new* file is loaded on every click. Without this directive, an old file may be loaded by the browser.
 */
angular.module('conduit.directives').directive('fileOnChange', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var onChangeHandler = scope.$eval(attrs.fileOnChange);
				element.bind('change', function(event)  {
					var files = event.target.files;
					onChangeHandler(files);
				});
				
				element.bind('click', function() {
					element.val('');
				});
			}
			
		};
	});