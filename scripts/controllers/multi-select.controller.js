angular.module('conduit.controllers').controller('MultiSelectCtrl', function($scope, $rootScope, ApiService, ArticlesService, ArrayTools) {			
	//Our model is going to be $scope.articles[$scope.currentIndex].books
	//Our menu is built by $scope.books
	//When item is clicked, we want to 1) push the book onto the model, or 2) remove the book from the model
	//We also need to update the 'checked' part of the menu

	var model = [];
	ArticlesService.getArticles().then(function() {
		model = $scope.articles[$scope.currentIndex].books;
		updateBook();
		updateLabel();
	});

	const defaultLabel = 'ADD'
	$scope.label = defaultLabel

	var updateLabel = function() {
		if(model.length < 1) {
			$scope.label = defaultLabel;
		} else if (model.length == 1) {
			$scope.label = model[0].name;
		} else if (model.length == 2) {
			$scope.label = model[0].name + ', ' + model[1].name;
		} else {
			$scope.label = model.length + ' SELECTED'
		}
	}

	var updateBook = function(newBooks, oldBooks) {	
		//Identify all of the books that existed before the $watch was triggered and still exist; add them to sameBooks
		if(newBooks && oldBooks) {
			var sameBooks = [];
			for(var i = 0; i < newBooks.length; i++) {
				for(var j = 0; j < oldBooks.length; j++) {
					if(newBooks[i].id === oldBooks[j].id)
						sameBooks.push(newBooks[i]);
				}
			}
			//.parse/stringify() is added to protect from reference errors that would overwrite the article's books
			let addedBooks = JSON.parse(JSON.stringify(newBooks));
			//Find the difference between new(added)Books and the books that existed before the $watch and still exist
			addedBooks = ArrayTools.diff(addedBooks, sameBooks);
			if(addedBooks.length > 0) {
				//Push these added books to the server
				ApiService.insert.bookStatus(addedBooks, $scope.articles[$scope.currentIndex].id).then(function(res) {/*no action needs to be taken*/});
			}

			let removedBooks = JSON.parse(JSON.stringify(oldBooks));
			//Find the difference between old(removed)Books and the books that existed before the $watch and still exist
			removedBooks = ArrayTools.diff(removedBooks, sameBooks);
			if(removedBooks.length > 0) {
				//Delete these books from the server
				ApiService.delete.bookStatus(removedBooks, $scope.articles[$scope.currentIndex].id).then(function(res) {/*no action needs to be taken*/})
			};
		}
		$rootScope.$broadcast('update-book');
		$scope.verifySelected();
		updateLabel();
	}

	$scope.$watch('currentIndex', function (newVal, oldVal) {
		model = $scope.articles[$scope.currentIndex].books;
		updateLabel();
	}, true);

	$scope.itemSelected = function(book) {
		let index = model.indexOf(book);
		let old = model.slice();
		if(index !== -1) {
			model = ArrayTools.removeElement(model, index);
		} else {
			model.push(book);
		}
		$scope.articles[$scope.currentIndex].books = model.slice();
		updateBook(model, old);
	}

	$scope.verifySelected = function() {
		for(var i = 0; i < $scope.books.length; i++) {
			$scope.books[i].selected = false;
			for(var j = 0; j < model.length; j++) {
				if($scope.books[i] == model[j]) {
					$scope.books[i].selected = true;
					break;
				}
			}
		}
	}

	$scope.isSelected = function(book) {
		let index = model.indexOf(book);
		if(index !== -1) {
			model = ArrayTools.removeElement(model, index);
		} else {
			model.push(book);
		}
	}
});