angular.module('conduit.tools').factory('DateTools', function($q, $http, $filter, __config) { 
	return {
		/**
		 * Determines if a date is newer than a given number of days back
		 * 
		 * @param {string/date} pubDate A date represented as a string or date object
		 * @param {int} numDays The number of days back; default is __config.MAX_DAYS_BACK
		 * @return {boolean} True if the date is newer (fewer than or equal to days back); false otherwise
		 */
        isNewerThan: function(pubDate, numDays)
		{
			if(typeof pubDate === 'string')
				pubDate = new Date(pubDate);
			
			//Set defaults
			if(!numDays)
				numDays = __config.MAX_DAYS_BACK;
							
			var d = new Date();
			
			return (pubDate >= (d.setDate(d.getDate() - numDays)));
		},
		/**
		 * Format the date to a specified string format (per angular standards) or to the Conduit default dd MMMM yyyy
		 * 
		 * @param {string/date} date A date represented as a string or date object
		 * @param {string} format Angular standard representation of format
		 * @return {string} Formatted date
		 */
		formatDate: function(date, format) {
			if(typeof date === 'string')
				date = new Date(date);
			if(!format)
				format = 'dd MMMM yyyy'
			return $filter('date')(date, format)	
		}
    };		
});