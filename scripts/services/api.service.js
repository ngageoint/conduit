/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('ApiService', function($http, $location) { 

	return {
	  	select: {
			articlesByUserFromDate: function(userId, date) {
				return new Promise(function(resolve, reject) {
					var query = '/select/articlesByUserFromDate?' +
								'userId=' + userId + 
								'&date=' + date;

					$http.get(query).then(function(response) {
						console.log(response.data);
						return resolve(response.data);
					}).catch(function(err) {
						return reject(err);
					});
				});
			}
		},
		generateHash: function(article) {
			return new Promise(function(resolve, reject) {
				if(article.title && article.text && article.images && article.source) {
					var data = {
						article: {
							title: article.title,
							text: article.text,
							images: article.images,
							source: article.source
						}
					}

					$http.post('/hash', data).then(function(response) {
						return resolve(response.data.hash);
					}).catch(function(err) {
						return reject(err);
					});
				} else {
					reject('Required hash fields not available')
				}
			});
		}
	};
});