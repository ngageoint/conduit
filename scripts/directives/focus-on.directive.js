angular.module('conduit.directives').directive('focusOn', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.focusOn, function(value) {
          if(value === true) { 
            console.log('value=',value);
            $timeout(function() {
              element[0].focus();
              scope[attrs.focusOn] = false;
            });
          }
        });
      }
    };
  });