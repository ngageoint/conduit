angular.module('conduit.tools').factory('XMLTools', function($q, $http, __config) { 
	return {
		/**
		 * Replace carriage returns with ooxml (Word's XML format) for a paragraph (hence the P)
		 * 
		 * @param {string} text Any block of text with carriage returns that need to be displated in Word
		 * @return {string} Proper XML
		 */
        ooxmlP: function(text) {
			var prefix = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:kinsoku w:val="0"/><w:overflowPunct w:val="0"/><w:spacing w:before="0"/><w:ind w:left="0" w:right="90"/></w:pPr><w:r><w:t>';
			var postfix = '</w:t></w:r></w:p>';
			var newline = '<w:br/>';
			
			return prefix + text.replace(/[\n\r]/g, newline) + postfix;
		}
    };		
});