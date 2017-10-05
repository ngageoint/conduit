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
		insert : {
			articleEdit: function(articleId, userId, teamId, title, text) {
				return new Promise(function(resolve, reject) {
					var data = {
						articleId: articleId,
						userId: userId,
						teamId: teamId,
						title: title,
						text: text
					}

					$http.post('/insert/articleEdit', data).then(function(response) {
						return resolve(response);
					}).catch(function(err) {
						return reject(err);
					});
				});
			},
			bookStatus: function(bookId, articleId) {
				return new Promise(function(resolve, reject) {
					var data = {
						bookId: bookId,
						articleId: articleId
					}

					$http.post('/insert/bookStatus', data).then(function(response) {
						return resolve(response);
					}).catch(function(err) {
						return reject(err);
					});
				});
			}
		},
		update : {
			articleBase: function(article) {
				return new Promise(function(resolve, reject) {
					var data = {
						article: article
					}

					$http.post('/update/articleBase', data).then(function(response) {
						console.log("successfully updated article base");
						return resolve(response);
					}).catch(function(err) {
						return reject(err);
					});
				});
			},
			articleStatus: function(articleId, userId, teamId, isRead) {
				return new Promise(function(resolve, reject) {
					var data = {
						articleId: articleId,
						userId: userId || 1,
						teamId: teamId || 1,
						isRead: isRead
					}

					$http.post('/update/articleStatus', data).then(function(response) {
						return resolve(response);
					}).catch(function(err) {
						return reject(err);
					});
				});
			}
		},
		delete : {
			bookStatus: function(bookId, articleId) {
				return new Promise(function(resolve, reject) {
					var data = {
						bookId: bookId,
						articleId: articleId
					}

					$http.post('/delete/bookStatus', data).then(function(response) {
						return resolve(response);
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