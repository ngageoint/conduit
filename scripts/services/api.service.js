/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('ApiService', function($http, $location, $window, UserService, __config) { 

	return {
	  	select: {
			articlesByUserFromDate: function(date) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var query = '/select/articlesByUserFromDate?' +
									'userId=' + user.id + 
									'&date=' + date + 
									(user.team ? '&teamId=' + user.team : '');

						console.log(query);

						$http.get(query).then(function(response) {
							console.log(response.data);
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			articleBlock: function(fromDate, numArticles, startingId) {
				//numArticles is required. For default, input 0
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var query = '/select/articleBlock?' +
									'userId=' + user.id + 
									'&teamId=' + (user.team ? user.team : 1) +
									'&fromDate=' + fromDate + 
									'&numArticles=' + (numArticles ? numArticles : __config.MIN_RENDERED_CARDS) +
									(startingId ? '&startingId=' + startingId : '');

						$http.get(query).then(function(response) {
							console.log(response.data);
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			articleOriginal: function(article) {
				return new Promise(function(resolve, reject) {
					
					return UserService.getUser().then(function(user) {
						var data = {
							article: article,
							userId: user.id,
							teamId: user.team
						}
						$http.post('/select/articleOriginal', data).then(function(response) {
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			mostRecentArticleEdit: function(article) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							article: article,
							userId: user.id,
							teamId: user.team
						}

						$http.post('/select/mostRecentArticleEdit', data).then(function(response) {
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			}
		},
		insert : {
			articleEdit: function(articleId, title, text) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							articleId: articleId,
							userId: user.id,
							teamId: user.team,
							title: title,
							text: text
						}

						$http.post('/insert/articleEdit', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			articleFull: function(article) {
				console.log("article full");
				console.log(article);
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							article: article,
							userId: user.id || 1,
							teamId: user.team || 1
						}

						$http.post('/insert/articleFull', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			comment: function(comment, articleId) {
				return new Promise(function(resolve, reject) {
					var data = {
						comment: comment,
						articleId: articleId,
						userId: comment.user.id,
						teamId: comment.user.team
					}

					$http.post('/insert/comment', data).then(function(response) {
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
			articleStatusRead: function(articleId, isRead) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							articleId: articleId,
							userId: user.id,
							teamId: user.team,
							isRead: isRead
						}

						$http.post('/update/articleStatusRead', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			articleStatusRemoved: function(articleId, isRemoved) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							articleId: articleId,
							userId: user.id,
							teamId: user.team,
							isRemoved: isRemoved
						}

						$http.post('/update/articleStatusRemoved', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
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