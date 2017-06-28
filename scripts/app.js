var config = {}
if(window) {
	
	if (typeof Object.assign != 'function') {
		
		/*Polyfill to support IE*/
		Object.assign = function(target) {
			
			'use strict';
			if (target == null) {
		  		throw new TypeError('Cannot convert undefined or null to object');
			}
	
			target = Object(target);
			
			for (var index = 1; index < arguments.length; index++)
		  		var source = arguments[index];
				if (source != null)
					for (var key in source)
			  			if (Object.prototype.hasOwnProperty.call(source, key))
							target[key] = source[key];
			return target;
	  	};
	}
	
	Object.assign(config, window.__config);
}

angular.module('conduit', [
    /*custom modules*/
    'conduit.directives', 'conduit.services', 'conduit.controllers', 'conduit.tools',
    
    /*vendor modules*/
    'xeditable', 'ui.bootstrap','nya.bootstrap.select', 'angular-loading-bar', 'ngAnimate',
    'infinite-scroll', 'tw.directives.clickOutside', 'cfp.loadingBar'
    ]);

angular.module('conduit').constant('__config', config);

/*Add custom modules
angular.module('conduit.directives');
angular.module('conduit.services');
angular.module('conduit.controllers');
angular.module('conduit.tools');*/


/*Add 3rd party modules*/

//Put a 10ms delay per card rendered in an infinite scroll event (which is MIN_RENDERED_CARDS / 2)
angular.module('infinite-scroll').value("THROTTLE_MILLISECONDS", (__config.MIN_RENDERED_CARDS / 2) * 10);

angular.module('conduit').run(function(editableOptions, editableThemes) {
		// set `default` theme for xedit
		editableOptions.theme = 'bs3';
	});