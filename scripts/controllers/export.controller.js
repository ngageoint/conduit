angular.module('conduit.controllers').controller('ExportCtrl', function($q, $scope, DateTools,XMLTools) {
		
	/*Returns a promise of a docx file*/
	var createFile = function(article) {			
		return new Promise(function(resolve, reject){			

			var loadFile=function(url,callback){
				JSZipUtils.getBinaryContent(url,callback);
			}
			loadFile("templates/export-tplt.docx",function(err,content){
				if (err) { throw e};
				doc=new Docxgen(content);
				doc.setData( {
					"title":article.title,
					"text":XMLTools.ooxmlP(article.text),
					"date": DateTools.formatDate(new Date()),
					"image":"example.jpg"
				}); //set the templateVariables
				doc.render() //apply them
				out=doc.getZip().generate({type:"blob"}) //Output the document using Data-URI
				
				if(out)
					resolve(out);
				else
					reject();
				
				return Promise.resolve(doc);
			})
		})
	}
	
	function getBase64Image(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
	
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
	
		var dataURL = canvas.toDataURL("image/png");
		return dataURL.replace('data:image/png;base64,', "");
	}
	
	$scope.export = function(article) {
		createFile(article).then(function(doc) {
			saveFile(getFirstChars(article.title, 75).replace('\\','-').replace('/','-'), doc, '.docx');
		});	
	}
	
	$scope.exportBook = function() {
		
		var createZip = function(zip) {
			if(JSZip.support.blob)
				zip.generateAsync({type : "blob"}).then(function(blob) {
					saveFile($scope.selectedBook.name + ' ' + DateTools.formatDate(new Date()), blob, '.zip')
				});
		}
					
		var loadAllFiles = function() {
				
				var promises = [];
				var promiseNames = [];//Not the best way to do this, but it'll work for now
				
				if($scope.selectedBook && $scope.articles)				
					for(var i = 0; i < $scope.articles.length - 1; i++)
						for(var j = 0; j < $scope.articles[i].books.length; j++)						
							if($scope.articles[i].books[j] && ~$scope.articles[i].books[j].name.indexOf($scope.selectedBook.name))
							{
								promises.push(createFile($scope.articles[i]));
								promiseNames.push(getFirstChars($scope.articles[i].title, 75).replace('\\','-').replace('/','-'));	
							}
				
				
				return $q.all(promises)
					.then(function(results) {
						for(var i = 0; i < results.length; i++)
							zip.file(promiseNames[i] + ".docx", results[i]);
						return zip;
					});
		}
		
		var zip = new JSZip();
		
		loadAllFiles().then(function(zip) {
			createZip(zip);	
		});
		}
	
	var saveFile = function(name, file, ext) {
		saveAs(file, name + ext);
	}
	
	var getFirstChars = function(str, numChars)
	{
		if(!numChars)
			numChars = 50;
		
		return (str ? 
					((str.length > numChars) ?
						str.substring(0, numChars) : 
						str) :
					'');
	}
});