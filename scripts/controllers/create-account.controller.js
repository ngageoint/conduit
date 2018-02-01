/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.controllers').controller('CreateAccountCtrl', function($scope, ApiService) {			
	$scope.teams = [{id: 2, name: "Sample Team", $$hashKey: "object:26"}];
	
	$scope.first = ''
	$scope.last = '';

	$scope.selectedTeam = undefined;
	$scope.itemSelected = false;
	if(typeof selectedTeam == 'undefined') {
		$scope.dropdownLabel = 'Select a team to join'
	}

	ApiService.select.teams().then(function(teams) {
		$scope.teams = teams;
	});

	$scope.teamSelected = function(team) {
		$scope.selectedTeam = team;
		$scope.dropdownLabel = team.name;
		$scope.itemSelected = true;
	}
});