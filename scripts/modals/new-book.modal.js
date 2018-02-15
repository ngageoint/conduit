/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.modals').controller('NewBookModalCtrl', function($scope, $uibModal, ApiService, BooksService) {			

	$scope.showForm = function () {
		$scope.message = "Show Form Button Clicked";
		console.log($scope.message);

		var uibModalInstance = $uibModal.open({
			templateUrl: '../templates/modals/new-book.modal.htm',
			controller: ModalInstanceCtrl,
			scope: $scope,
			size: 'md',
			resolve: {
				name: function () {
					return $scope.name;
				}
			}
		});

		uibModalInstance.result.then(function (name) {
			console.log('result')
			console.log(name)
			/*ApiService.insert.book(name).then(function(book) {
				$scope.books.push({	id: book.data.id,
							name: name});
			});*/
		}, function () {

		});
	};
});

var ModalInstanceCtrl = function ($scope, $uibModalInstance, name, ApiService) {
	$scope.name = '';
	$scope.addBook = function (name) {
		if($scope.name.length > 0) {
			ApiService.insert.book(name).then(function(book) {
				$scope.books.push({	id: book.data.id,
							name: name});
				$scope.name = '';

				//If no book has been selected yet, select the new book
				if(typeof $scope.selectedBook === 'undefined') {
					$scope.selectedBook = $scope.books[$scope.books.length - 1];
				}
			});
		}
	};

	$scope.deleteBook = function(bookId) {
		(function(id) {
			ApiService.delete.book(id).then(function() {
				for(let i = 0; i < $scope.books.length; i++) {
					if($scope.books[i].id == id) {
						$scope.books.splice(i, 1);
						console.log('match found');
					}
				}
				if($scope.selectedBook.id == id) {
					if(typeof $scope.books[0] !== 'undefined') {
						$scope.selectedBook = $scope.books[0];
					} else {
						$scope.selectedBook = undefined;
					}
				}
				console.log('deleted');
		});
	})(bookId)
	}

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};