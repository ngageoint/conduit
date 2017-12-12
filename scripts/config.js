//Config variables

(function (window) {
	window.__config = window.__config || {};
	
	window.__config.articlesUrl = './data/sample-data.json';
	window.__config.exportTpltUrl = './templates/export-tplt.docx'

	
	window.__config.MAX_DAYS_BACK = 5; //Will delete anything older than this many days, and will cap the filter at this many days
	window.__config.DEFAULT_DAYS_BACK = 5;
	window.__config.MIN_RENDERED_CARDS = 10; //The minimum number of cards that need to be rendered at any given time; this number should be large enough to force a scrollbar.
	
}(this));