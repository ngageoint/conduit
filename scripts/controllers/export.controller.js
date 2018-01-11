angular.module('conduit.controllers').controller('ExportCtrl', function($q, $scope, ApiService, DateTools, XMLTools, __config) {
	/**
	 * This function exports a given article into a .docx file based on the template provided in Conduit
	 * 
	 * @param {object} article An article following the minimum Conduit format
	 */
	$scope.export = function(article) {
		ApiService.exportFile(article).then(function(res) {
		});
	}
});