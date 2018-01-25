const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module')
const request = require('request');
const axios = require('axios');
const niv = require('npm-install-version');

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1'); //Timestamp-based uuid
const glob = require('glob');

const audit = require(path.join('..', 'tools', 'audit-log.service.js'));

var tpltId = 1//TODO: This will eventually be identified by the team, or even by the user at export

/**
 * Async download an image from a given url and write it to the server
 * 
 * @param {string} uri The uri of the image
 * @param {string} id An id to uniquely identify this image; this id should be inherited from the document id to allow garbage cleanup
 * @return {string} The filepath to the downloaded image
 */
var downloadImage = function(uri, id) {
    return new Promise(function(resolve, reject) {
        var filePath = path.resolve(__dirname, 'temp', (id || uuid()) + path.extname(uri));
        
        return axios.get(uri).then(function (response) {
            return request(uri).pipe(fs.createWriteStream(filePath))
                        .on('finish', function() {
                            audit.CREATE(audit.SUCCESS, audit.FILE, id, filePath, audit.SYSTEM);
                            return resolve(filePath);
                        })
                        .on('error', function(err) {
                            audit.CREATE(audit.FAILURE, audit.FILE, id, filePath, audit.SYSTEM);
                            return reject(err);
                        })
        }).catch(function(err) {
            return reject(err);
        });
        
        
    });
}

/**
 * Given an article and template, generate a formatted word document and save it to the server. Async.
 * 
 * @param {object} article The article to export
 * @param {string} tpltId The id of the requested template
 * @param {string} id A uuid to uniquely identify the files while they reside on the server
 * @return {string} The filepath to the Word document
 */
var generateWordDoc = function(article, tpltId, id) {
    return new Promise(function(resolve, reject) {

        /**
         * Given processed article data and a template, generate a formatted word document and save it to the server. Async.
         * 
         * @param {object} data The key/value pairs to be injected into the document
         * @param {string} id A uuid to uniquely identify the files while they reside on the server; this id should be inherited to allow garbage cleanup
         * @return {string} The filepath to the Word document
         */
        //IF ERR: data was typoed as dat; corrected, but have not verified everything doesn't fall to pieces.
        var generateDoc = function(data, id) {
            return new Promise(function(resolve, reject) {
                
                if(!tpltId) {
                    tpltId = 1;
                }
                
                //Load the docx file as a binary
                var content = fs
                    .readFileSync(path.resolve(__dirname, 'templates', 'tplt-id-' + tpltId + '.docx'), 'binary');

                var zip = new JSZip(content);

                //Set image options
                var opts = {}
                opts.centered = false;
                opts.getImage=function(tagValue, tagName) {
                    return fs.readFileSync(tagValue);
                }
                
                opts.getSize=function(img,tagValue, tagName) {
                    
                    var aspectRatio = .75;
                    var width = 600;
                    var height = width * aspectRatio
                    
                    return [width,height];
                }
                
                var imageModule=new ImageModule(opts);

                //Attach modules and load data
                var doc = new Docxtemplater()
                    .attachModule(imageModule)
                    .loadZip(zip)
                    .setData(data)
                    .render();
                doc.loadZip(zip);

                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render()
                }
                catch (error) {
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log(JSON.stringify({error: e}));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    return reject(error);
                    throw error;
                }

                var buf = doc.getZip().generate({type: 'nodebuffer'});

                var filename = path.resolve(__dirname, 'temp',  (id || uuid()) + '.docx')

                // buf is a nodejs buffer; here we write it to a file in the temp folder on the server.
                fs.writeFileSync(filename, buf);
                if(fs.existsSync(filename)) {
                    audit.CREATE(audit.SUCCESS, audit.FILE, id, filename, audit.SYSTEM);
                } else {
                    audit.CREATE(audit.FAILURE, audit.FILE, id, fileName, audit.SYSTEM);
                }
                
                return resolve(path.basename(filename));
            });
        }
    
        //If the article has an image
        if(article.imageUri) {
            //Download the image, add it to the data object, and call generateDoc()
            return downloadImage(article.imageUri, id).then(function(imagePath) {
                data = {
                    "title":    article.title,
                    "text":     article.text,
                    "date":     new Date(),
                    image:      imagePath
                }

                return generateDoc(data, id).then(function(filename) {
                    return resolve(filename);
                }).catch(function(err) {
                    return reject(err);
                })
            }).catch(function(err) {
                //If the image could not be loaded, generate the doc without the image
                console.log(err);

                data = {
                    "title":    article.title,
                    "text":     article.text,
                    "date":     new Date()
                }

                return generateDoc(data, id).then(function(filename) {
                    return resolve(filename);
                }).catch(function(err) {
                    return reject(err);
                })
            });
        } else {
            //If there is no image, generate the doc
            data = {
                "title":    article.title,
                "text":     article.text,
                "date":     new Date()
            }

            return generateDoc(data, id).then(function(filename) {
                return resolve(filename);
            }).catch(function(err) {
                return reject(err);
            });
        }
    });
}

/**
 * Delete all files of a given filename, regardless of extension. In the export logic, all resource files for a given export will have the same name,
 * and only be unique through their extension.
 * 
 * @param {array} file The filepath to the file to be deleted
 */
var deleteTemporaryFiles = function (fileName) {
    glob(fileName.replace(/\.[^/.]+$/, "") + '*', function(err, files) {
        for(var i = 0; i < files.length; i++) {
            (function(thisFile) {
                fs.unlink(files[i], function(err) {
                    if(err) {
                        audit.DELETE(audit.FAILURE, audit.FILE, thisFile, audit.SYSTEM);
                    } else {
                        audit.DELETE(audit.SUCCESS, audit.FILE, thisFile, audit.SYSTEM);
                    }
                })
            }(files[i]));
        }
    })    
}

/**
 * Given an array of articles, create a .zip file on the server with formatted word documents of every article. Async.
 * 
 * @param {array} a An array of articles
 * @param {string} tpltId The id for the requested export template
 * @return {string} The filepath to the .zip file
 */
var generateZip = function(articles, tpltId) {
    return new Promise(function(resolve, reject) {
        var promises = [];//An array to store all of the promises before putting them in $q
        var promiseNames = [];//The names associated with each docx boject

        var id = uuid();

        for(var i = 0; i < articles.length; i++) {
            promises.push(generateWordDoc(articles[i], tpltId, id + '.' + articles[i].title));
        }

        //Resolve all promises and add to the JSZip object
        return Promise.all(promises).then(function(results) {
                
                var fileName = path.resolve(__dirname, 'temp', id);

                var zip = {}
                
                //The version of jszip required by docxtemplater does not support blobs
                //But blobs are needed to export a zip
                var jszip3x = undefined;
                if(!JSZip.support.blob) {
                    niv.install('jszip@3.1.4');
                    jszip3x = niv.require('jszip@3.1.4');
                }

                zip = new jszip3x() || new JSZip();

                //Read all of the .docx files with the specified id
                return glob(fileName + '*', function(err, files) {
                    for(var i = 0; i < files.length; i++) {
                        if(path.extname(files[i]) === '.docx') {
                            zip.file(files[i].substring(files[i].indexOf(id) + id.length + 1), fs.readFileSync(files[i])); 
                        }       
                    }

                    fileName = path.resolve(__dirname, 'temp', id + '.zip');

                    //Zip 'em up!
                     zip.generateAsync({type : "nodebuffer"}).then(function(buf) {
                        fs.writeFileSync(fileName, buf);
                        if(fs.existsSync(fileName)) {
                            audit.CREATE(audit.SUCCESS, audit.FILE, id, fileName, audit.SYSTEM);
                        } else {
                            audit.CREATE(audit.FAILURE, audit.FILE, id, fileName, audit.SYSTEM);
                        }
                        return resolve(fileName);
                    }).catch(function(err) {
                        audit.CREATE(audit.FAILURE, audit.FILE, id, fileName, audit.SYSTEM);
                        return reject(err);
                    });
                });
            });
    });
}

module.exports = {
    generateWordDoc: generateWordDoc,
    generateZip: generateZip,
    deleteTemporaryFiles: deleteTemporaryFiles
}