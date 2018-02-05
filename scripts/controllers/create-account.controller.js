/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.controllers').controller('CreateAccountCtrl', function($scope, $location, $route, $timeout, Reload, ApiService) {			

	$scope.teams = [{id: 2, name: "Sample Team", $$hashKey: "object:26"}];
	
	$scope.first = ''
	$scope.last = '';

	$scope.selectedTeam = undefined;
	$scope.itemSelected = false;
	$scope.teamDropdownFocus = false;
	if(typeof selectedTeam == 'undefined') {
		$scope.dropdownLabel = 'Select a Team'
	}

	ApiService.select.teams().then(function(teams) {
		$scope.teams = teams;
	});

	$scope.teamSelected = function(team) {
		$scope.selectedTeam = team;
		$scope.dropdownLabel = team.name;
		$scope.itemSelected = true;
	}

	$scope.formComplete = function() {
		return (!(typeof $scope.first === 'undefined') && !(typeof $scope.last === 'undefined') && $scope.itemSelected)
	}

	$scope.createAccount = function() {
		console.log('submit event');
		if($scope.formComplete()) {
			ApiService.insert.user($scope.first, $scope.last, $scope.first, $scope.selectedTeam.id).then(function(res) {
				$location.$$search.id = res.data.id;
				$timeout(function () {
					Reload.setEnabled(true);
					$location.path('/');
				});
			})
		}
	}
});