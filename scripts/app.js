/*Create config variable in window*/

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

/*Polyfill to support IE*/
if(typeof Promise == "undefined")
	location.href = location.origin + '/' + 'unsupported';

angular.module('conduit', [
    /*custom modules*/
    'conduit.directives', 'conduit.services', 'conduit.controllers', 'conduit.tools',
    
    /*vendor modules*/
    'ngRoute', 'xeditable', 'ui.bootstrap','nya.bootstrap.select', 'angular-loading-bar', 'ngAnimate',
    'infinite-scroll', 'tw.directives.clickOutside', 'cfp.loadingBar'
    ]);

angular.module('conduit').constant('__config', config);

/*Configure 3rd party modules*/

angular.module('conduit').config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);

//Put a 10ms delay per card rendered in an infinite scroll event (which is MIN_RENDERED_CARDS / 2)
angular.module('infinite-scroll').value("THROTTLE_MILLISECONDS", (__config.MIN_RENDERED_CARDS / 2) * 10);

angular.module('conduit').run(function(editableOptions, editableThemes) {
		// set `default` theme for xedit
		editableOptions.theme = 'bs3';
	});