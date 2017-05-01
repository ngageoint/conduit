angular.module('conduit.tools').factory('DateTools', function($q, $http, __config) { 
	return {
        isNewerThan: function(pubDate, numDays)
		{
			if(typeof pubDate === 'string')
				pubDate = new Date(pubDate);
			
			if(!numDays)
				numDays = __config.MAX_DAYS_BACK;
							
			var d = new Date();
			
			return (pubDate >= (d.setDate(d.getDate() - numDays)));
		}
    };		
});