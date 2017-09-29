/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('ApiService', function($http, $location) { 

	return {
	  select: {
			articlesByUserFromDate: function(userId, date) {
				return new Promise(function(resolve, reject) {
					var query = '/select/articlesByUserFromDate?' +
								'userId=' + userId + 
								'&date=' + date;
					console.log(query);

					$http.get(query).then(function(response) {
						console.log(response.data);
						return resolve(response.data);
					}).catch(function(err) {
						return reject(err);
					});
				});
			}
		}
	};
});