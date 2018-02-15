/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.controllers').controller('CreateAccountCtrl', function($scope, $location, $route, $timeout, Reload, ApiService) {			

	$scope.teams = [{id: 2, name: "Sample Team", $$hashKey: "object:26"}];
	
	$scope.first = '';
	$scope.last = '';
	$scope.teamName = '';

	$scope.fieldLimit = 64;
	$scope.showCounterAt = $scope.fieldLimit * .75;
	console.log($scope.showCounterAt);

	$scope.createTeam = false;
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
		$scope.createTeam = false;
		$scope.selectedTeam = team;
		$scope.dropdownLabel = team.name;
		$scope.itemSelected = true;
	}

	$scope.enableCreateTeam = function (enabled) {
		$scope.createTeam = enabled;
		$scope.itemSelected = true;
		if(enabled) {
			$scope.dropdownLabel = 'Create New Team';
		} else {
			$scope.dropdownLabel = 'Select a Team'
		}
	}

	$scope.formComplete = function() {
		if($scope.createTeam && $scope.teamName.length <= 0) {
			return false;
		} else {
			return (($scope.first.length > 0 && $scope.first.length <= $scope.fieldLimit) && ($scope.last.length > 0 && $scope.last.length <= $scope.fieldLimit) && $scope.itemSelected);
		}
	}

	$scope.createAccount = function() {
		console.log('submit event');
		if($scope.formComplete()) {
			if($scope.createTeam) {
				ApiService.insert.team($scope.teamName).then(function(team) {
					ApiService.insert.user($scope.first, $scope.last, $scope.first, team.data.id).then(function(res) {
						$location.$$search.id = res.data.id;
						$timeout(function () {
							Reload.setEnabled(true);
							$location.path('/');
						});
					})
				})
			} else {
				ApiService.insert.user($scope.first, $scope.last, $scope.first, $scope.selectedTeam.id).then(function(res) {
					$location.$$search.id = res.data.id;
					$timeout(function () {
						Reload.setEnabled(true);
						$location.path('/');
					});
				})
			}
			
		}
	}
});