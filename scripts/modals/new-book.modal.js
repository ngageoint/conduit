/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.modals').controller('NewBookModalCtrl', function($scope, $uibModal, ApiService) {			

	$scope.showForm = function () {
		$scope.message = "Show Form Button Clicked";
		console.log($scope.message);

		var uibModalInstance = $uibModal.open({
			templateUrl: '../templates/modals/new-book.modal.htm',
			controller: ModalInstanceCtrl,
			scope: $scope,
			size: 'sm',
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
	console.log('in modal instance controller');
	$scope.addBook = function (name) {
		//console.log('in add book');
		//console.log(name);
		
		$uibModalInstance.close(name);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};