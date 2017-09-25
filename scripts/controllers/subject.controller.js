/* This controller manages the subject line for each article. Why? On some networks,
the subject line will require a bit of processing to enforce compliance. This processing
is different for each network, so this makes it easy to manage*/

angular.module('conduit.controllers').controller('SubjectCtrl', function($scope) {	
	$scope.subject = function(article) {
		if(!article)
			return '';
		return article.source;
	}
});