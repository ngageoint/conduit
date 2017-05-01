angular.module('conduit.controllers').controller('ExportCtrl', function($q, $scope) {
		
	/*Retruns a promise of a docx file*/
	var createFile = function(article) {			
		return new Promise(function(resolve, reject){
			
			function loadImg(src, callback) {
				myimg = new Image();
				myimg.onload = callback;
				myimg.src = src;
			}
			
			loadImg('example.jpg', function() {
				createDoc();
			});
				
			createDoc = function() {
			
				var opts = {}
				opts.centered = false;
				opts.getImage=function(tagValue, tagName) {
					return getBase64Image(myimg);
				}
			
				opts.getSize=function(img,tagValue, tagName) {  
					return [200,200];
				}
			
				var imageModule=new window.ImageModule(opts);
				
				var loadFile=function(url,callback){
					JSZipUtils.getBinaryContent(url,callback);
				}
				loadFile("templates/export-tplt.docx",function(err,content){
					if (err) { throw e};
					doc=new Docxgen(content);
					
					doc.attachModule(imageModule);
					doc.setData( {
						"title":article.title,
						"text":ooxmlP(article.text),
						"date": $scope.formatDate(new Date()),
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
			}
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
					saveFile($scope.selectedBook.name + ' ' + $scope.formatDate(new Date()), blob, '.zip')
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