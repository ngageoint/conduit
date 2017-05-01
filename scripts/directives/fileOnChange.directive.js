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