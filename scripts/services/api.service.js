/* The DataSourceService makes all of the data source properties available in a global, editable promise. */
angular.module('conduit.services').factory('ApiService', function($http, $location, $window, UserService, __config) { 

	return {
	  	select: {
			/*DEPRECIATED
			articlesByUserFromDate: function(date) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var query = '/select/articlesByUserFromDate?' +
									'userId=' + user.id + 
									'&date=' + date + 
									(user.teamId ? '&teamId=' + user.teamId : '');

						$http.get(query).then(function(response) {
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},*/
			articleBlock: function(fromDate, numArticles, startingId) {
				//numArticles is required. For default, input 0
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var query = '/select/articleBlock?' +
									'userId=' + user.id + 
									'&teamId=' + (user.teamId ? user.teamId : 1) +
									'&fromDate=' + fromDate + 
									'&numArticles=' + (numArticles ? numArticles : __config.MIN_RENDERED_CARDS) +
									(startingId ? '&startingId=' + startingId : '');

						var config = {
							ignoreLoadingBar: startingId ? true : false
						}

						$http.get(query, config).then(function(response) {
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
						return UserService.getUser().then(function(user) {
							var data = {
								article: article,
								userId: user.id,
								teamId: user.teamId
							}
							$http.post('/select/articleOriginal', data).then(function(response) {
								return resolve(response.data);
							}).catch(function(err) {
								return reject(err);
							});
						});
					});
				});
			},
			mostRecentArticleEdit: function(article) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							article: article,
							teamId: user.teamId
						}

						$http.post('/select/mostRecentArticleEdit', data).then(function(response) {
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			editContent: function(articleId, editObject) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						return UserService.getUser().then(function(user) {
							var query = '/select/editContent?' +
										'articleId=' + articleId +
										'&teamId=' + user.teamId + 
										'&timestamp=' + editObject.timestamp;

							console.log(query);

							$http.get(query).then(function(response) {
								return resolve(response.data);
							}).catch(function(err) {
								return reject(err);
							});
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
							teamId: user.teamId,
							title: title,
							text: text
						}

						$http.post('/insert/articleEdit', data).then(function(response) {
							return resolve(response.data);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},/*DEPRECIATED
			articleFull: function(article) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							article: article,
							userId: user.id,
							teamId: user.teamId
						}

						$http.post('/insert/articleFull', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},*/
			comment: function(comment, articleId) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							comment: comment,
							articleId: articleId,
							userId: comment.user.id,
							teamId: comment.user.teamId
						}

						$http.post('/insert/comment', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
					});
				});
			},
			bookStatus: function(bookId, articleId) {
				return new Promise(function(resolve, reject) {
					return UserService.getUser().then(function(user) {
						var data = {
							bookId: bookId,
							articleId: articleId,
							userId: user.id,
							teamId: user.teamId
						}

						$http.post('/insert/bookStatus', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
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
							teamId: user.teamId,
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
							teamId: user.teamId,
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
					return UserService.getUser().then(function(user) {
						var data = {
							bookId: bookId,
							articleId: articleId,
							userId: user.id,
							teamId: user.teamId
						}

						$http.post('/delete/bookStatus', data).then(function(response) {
							return resolve(response);
						}).catch(function(err) {
							return reject(err);
						});
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