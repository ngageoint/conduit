angular.module('conduit.tools').factory('XMLTools', function($q, $http, __config) { 
	return {
        ooxmlP: function(paragraph) {
			var prefix = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:kinsoku w:val="0"/><w:overflowPunct w:val="0"/><w:spacing w:before="0"/><w:ind w:left="0" w:right="90"/></w:pPr><w:r><w:t>';
			var postfix = '</w:t></w:r></w:p>';
			var newline = '<w:br/>';
			
			return prefix + paragraph.replace(/[\n\r]/g, newline) + postfix;
		}
    };		
});