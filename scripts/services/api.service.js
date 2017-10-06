/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('ApiService', function($http, $location, $window) { 

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
		},
		exportFile: function(article) {
			return new Promise(function(resolve, reject) {
				if(article.id && article.title && article.text && article.date) {
					var data = {
						article: {
							id: article.id,
							title: article.title,
							text: article.text,
							date: article.date,
							imageUri: article.images[0] || article.images[article.selectImage]
						},
						tpltId: 1
					}

					$http.post('/export', data).then(function(response) {
						console.log(response.data);
						$window.open('/download?fileName=' + response.data);
						return resolve(response.data);
					}).catch(function(err) {
						return reject(err);
					});
				} else {
					reject('Required fields not available')
				}
			});
		},
		exportBook: function(book, articles) {
			return new Promise(function(resolve, reject) {
				
				var formattedArticles = []

				for(var i = 0; i < articles.length; i++)
				{
					formattedArticles.push({
						id: articles[i].id,
						title: articles[i].title,
						text: articles[i].text,
						date: articles[i].date,
						imageUri: articles[i].images[0] || articles[i].images[articles[i].selectImage]
					})
				}
				
				if(book && articles) {
					var data = {
						book: book,
						articles: formattedArticles,
						tpltId: 1
					}

					$http.post('/exportZip', data).then(function(response) {
						console.log("got return");
						console.log(response.data);
						$window.open('/download?fileName=' + response.data);
						return resolve(response.data);
					}).catch(function(err) {
						return reject(err);
					});
				} else {
					reject('Required fields not available')
				}
			});
		}
	}
});