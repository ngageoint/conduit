angular.module('conduit.tools').factory('ComplexPropertyTools', function($q, $http, __config) { 
	return {
		/**
		 * Some objects pulled from feeds or APIs may have property hierarchies that are difficult to reference
		 * programatically and dynamically. For example, an object may be 'mammal.human.name.last'. It would be 
		 * difficult for Conduit to be able to reference anything beyond 'mammal' automatically and would probably
		 * try to treat the whole string as one property. This function allows Conduit to look deeper into an object 
		 * by delimiting a string into a series of properties; conduit will be able to see 'mammal', 'human', 
		 * 'name', and 'last' as separate properties and will pull the object at the 'last' property, eg 'Doe'.
		 * 
		 * Conduit runs every property provided in the Source.json file through this function. If a property
		 * contains a '.'* (eg human['first.name']), the '.' should be replaced with another character or Conduit
		 * should be modified to identify a different delimiter.
		 * 		*yell at whoever does this
		 * 
		 * @param {object} obj The object from which the property will be pulled
		 * @param {string} prop A string presenting the complex property
		 * @param {string} delimiter A char or string reprsenting how the complex property will be delimited; default '.'
		 * @return {object} The object at the complex property
		 */
        getComplexProperty: function(obj, prop, delimiter) {
			if(typeof obj === 'undefined')
				return false;
			if(typeof delimiter === 'undefined')
				delimiter = '.';
			
			var _index = prop.indexOf(delimiter);
			if(_index > -1)
				return getComplexProperty(obj[prop.substring(0, _index)], prop.substr(_index + 1), delimiter)
			return obj[prop];
		}
    };		
});