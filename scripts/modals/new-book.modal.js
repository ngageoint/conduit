/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.modals').controller('NewBookModalCtrl', function($scope, $uibModal) {			

	$scope.showForm = function () {
		$scope.message = "Show Form Button Clicked";
		console.log($scope.message);

		var modalInstance = $uibModal.open({
			templateUrl: '../templates/modals/new-book.modal.htm',
			controller: ModalInstanceCtrl,
			scope: $scope,
			resolve: {
				userForm: function () {
					return $scope.userForm;
				}
			}
		});

		uibModalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {

		});
	};
});

var ModalInstanceCtrl = function ($scope, $uibModalInstance, userForm) {
    $scope.form = {}
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
            console.log('user form is in scope');
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};