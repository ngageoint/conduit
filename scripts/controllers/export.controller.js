angular.module('conduit.controllers').controller('ExportCtrl', function($q, $scope, ApiService, DateTools, XMLTools, __config) {
		
	/**
	 * This function takes an article and creates a promise of a .docx blob.
	 * 
	 * @param {object} article An article following the minimum Conduit format
	 * @return {promise} A promise of a .docx blob
	 * */
	var createFile = function(article) {			
		return new Promise(function(resolve, reject){			

			/**
			 * This function loads a file, namely the .docx template file, and then excutes a callback upon fulfilment of the promise
			 * 
			 * @param {string} url The location of the file to be loaded
			 * @param {function} callback The callback to execule after the file has been loaded
			 */
			var loadFile=function(url,callback){
				JSZipUtils.getBinaryContent(url,callback);
			}

			//Callback function creates docx blob and returns promise
			loadFile(__config.exportTpltUrl, function(err,content){
				if (err) { throw e};
				doc=new Docxgen(content);
				doc.setData( {
					"title":article.title,
					"text":XMLTools.ooxmlP(article.text),
					"date": DateTools.formatDate(new Date())
				}); //set the templateVariables
				doc.render() //apply them
				out=doc.getZip().generate({type:"blob"}) //Output the document using Data-URI
				
				//If the blob was successful, resolve the promise
				if(out)
					resolve(out);
				else
					reject();
				
				//Return promise
				return Promise.resolve(doc);
			})
		})
	}
	
	/**
	 * This function exports a given article into a .docx file based on the template provided in Conduit
	 * 
	 * @param {object} article An article following the minimum Conduit format
	 */
	$scope.export = function(article) {
		ApiService.exportFile(article).then(function(res) {
			console.log(res);
			//saveFile(getFirstChars(article.title, 75).replace('\\','-').replace('/','-'), doc, '.docx');
		});
		
		/*createFile(article).then(function(doc) {
			saveFile(getFirstChars(article.title, 75).replace('\\','-').replace('/','-'), doc, '.docx');
		});*/	
	}
	
	/**
	 * This function exports all of the articles in the currently selected book.
	 */
	$scope.exportBook = function() {
		
		/**
		 * This function creates a .zip blob and saves it
		 * 
		 * @param {JSZip} zip A populated JSZip object
		 */
		var createZip = function(zip) {
			if(JSZip.support.blob)
				zip.generateAsync({type : "blob"}).then(function(blob) {
					saveFile($scope.selectedBook.name + ' ' + DateTools.formatDate(new Date()), blob, '.zip')
				});
		}

		/**
		 * This function will load all files in the selected book and return as a JSZip object promise
		 */	
		var loadAllFiles = function() {
				
				var promises = [];//An array to store all of the promises before putting them in $q
				var promiseNames = [];//The names associated with each docx boject
				
				//Add all necessary .docx blob promises to the promsies array
				if($scope.selectedBook && $scope.articles)				
					for(var i = 0; i < $scope.articles.length - 1; i++)
						for(var j = 0; j < $scope.articles[i].books.length; j++)						
							if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.selectedBook.name))
							{
								promises.push(createFile($scope.articles[i]));
								promiseNames.push(getFirstChars($scope.articles[i].title, 75).replace('\\','-').replace('/','-'));	
							}
				
				//Resolve all promises and add to the JSZip object
				return $q.all(promises)
					.then(function(results) {
						for(var i = 0; i < results.length; i++)
							zip.file(promiseNames[i] + ".docx", results[i]);
						return zip;
					});
		}
		
		var zip = new JSZip();
		
		var articlesInBook = []

		if($scope.selectedBook && $scope.articles){	
			for(var i = 0; i < $scope.articles.length - 1; i++) {
				for(var j = 0; j < $scope.articles[i].books.length; j++) {
					if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.selectedBook.name)) {
						articlesInBook.push($scope.articles[i]);
					}
				}
			}
			ApiService.exportBook($scope.selectedBook, articlesInBook).then(function(res) {

			});
		}

		//Once all the files have been loaded and the JSZip promise successfully returned, create and save the zip
		/*
		loadAllFiles().then(function(zip) {
			createZip(zip);	
		});
		}*/
	}
	
	/**
	 * Given file info, this function will save the file to the user's machine with standard 'Save As' prompts
	 * 
	 * @param {string} name The name of the file
	 * @param {blob} file The file blob
	 * @param {string} ext The file extension
	 */
	var saveFile = function(name, file, ext) {
		saveAs(file, name + ext);
	}
	
	/**
	 * Get the first x characters of a string
	 * 
	 * @param {string} str The string to be parsed
	 * @param {int} numChars The number of characters to be parsed; optional, default 50
	 * @return The first x characters of the string
	 */
	var getFirstChars = function(str, numChars)
	{
		//Set defaults
		if(!numChars)
			numChars = 50;
		
		return (str ? 
					((str.length > numChars) ?
						str.substring(0, numChars) : 
						str) :
					'');
	}
});