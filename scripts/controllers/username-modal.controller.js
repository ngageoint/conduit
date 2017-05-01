angular.module('conduit.controllers').controller('UsernameModalCtrl', function ($scope, $uibModal, $log, $document) {

	var $ctrl = this;
	
	$ctrl.user = '';
	
	$ctrl.open = function(size, parentSelector) {
		var parentElem = parentSelector ?
			angular.element($document[0].querySelector('.username-modal ' + parentSelector)) : undefined;
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: './templates/modal-username.html',
			controller: 'usernameModalInstanceCtrl',
			controllerAs: '$ctrl',
			size: size,
			scope: $scope,
			appendTo: parentElem,
			resolve: {
				user: function() {
					return $ctrl.user;	
				}
			}
		});
		
		modalInstance.result.then(function (user) {
			$scope.setUserInfo(user);
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}		
});

angular.module('conduit.controllers').controller('usernameModalInstanceCtrl', function ($uibModalInstance, user) {
	var $ctrl = this;
	$ctrl.name = user.name;
	$ctrl.user = {
		name: $ctrl.name,
	};
		
	$ctrl.ok = function () {
		$uibModalInstance.close($ctrl.user);	
	}
	
	$ctrl.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	}
});