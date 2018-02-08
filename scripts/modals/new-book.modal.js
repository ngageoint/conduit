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
			ApiService.insert.book(name).then(function(book) {
				$scope.books.push({	id: book.data.id,
							name: name});
			});
		}, function () {

		});
	};
});

var ModalInstanceCtrl = function ($scope, $uibModalInstance, name) {
	$scope.name = '';
	$scope.addBook = function (name) {
		if($scope.name.length > 0) {
			$uibModalInstance.close(name);
		}
	};

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};