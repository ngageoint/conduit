angular.module('conduit.tools').factory('DateTools', function($q, $http, $filter, __config) { 
	return {
        isNewerThan: function(pubDate, numDays)
		{
			if(typeof pubDate === 'string')
				pubDate = new Date(pubDate);
			
			if(!numDays)
				numDays = __config.MAX_DAYS_BACK;
							
			var d = new Date();
			
			return (pubDate >= (d.setDate(d.getDate() - numDays)));
		},
		formatDate: function(date) {
			if(typeof date === 'string')
				date = new Date(date);
			return $filter('date')(date, 'dd MMMM yyyy')	
		}
    };		
});