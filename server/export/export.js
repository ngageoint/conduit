const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module')
const request = require('request');
const axios = require('axios');
var AdmZip = require('adm-zip');

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1'); //Timestamp-based uuid
const glob = require('glob');

var tpltId = 1

var downloadImage = function(uri, id) {
    return new Promise(function(resolve, reject) {
        var filePath = path.resolve(__dirname, 'temp', (id || uuid()) + path.extname(uri));
        
        return axios.get(uri).then(function (response) {
            return request(uri).pipe(fs.createWriteStream(filePath))
                        .on('finish', function() {
                            return resolve(filePath);
                        })
                        .on('error', function(err) {
                            return reject(err);
                        })
        }).catch(function(err) {
            return reject(err);
        });
        
        
    });
}

var generateWordDoc = function(article, tpltId, id) {
    return new Promise(function(resolve, reject) {
        var generateDoc = function(dat, id) {
            return new Promise(function(resolve, reject) {
                //Load the docx file as a binary
                if(!tpltId)
                tpltId = 1;
                
                var content = fs
                    .readFileSync(path.resolve(__dirname, 'templates', 'tplt-id-' + tpltId + '.docx'), 'binary');

                var zip = new JSZip(content);

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

                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                fs.writeFileSync(filename, buf);
                
                return resolve(path.basename(filename));
            });
        }
        
        if(article.imageUri) {
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

var deleteTemporaryFiles = function (fileName) {
    glob(fileName.replace(/\.[^/.]+$/, "") + '*', function(err, files) {
        for(var i = 0; i < files.length; i++) {
            fs.unlink(files[i], function() {

            })
        }
    })    
}

var generateZip = function(articles, tpltId) {
    return new Promise(function(resolve, reject) {
        var promises = [];//An array to store all of the promises before putting them in $q
        var promiseNames = [];//The names associated with each docx boject

        var id = uuid();

        

        for(var i = 0; i < articles.length; i++) {
            promises.push(generateWordDoc(articles[i], tpltId, id + '.' + articles[i].title));
        }

        //Resolve all promises and add to the JSZip object
        return Promise.all(promises)
            .then(function(results) {
                
                var zip = new AdmZip();

                var fileName = path.resolve(__dirname, 'temp', id);

                glob(fileName + '*', function(err, files) {
                    for(var i = 0; i < files.length; i++) {
                        zip.addFile('test.txt', fs.readFileSync(files[i], '', 0644 << 16));
                    }

                    console.log("fuusged fir kiio")

                    var entries = zip.getEntries();
                    for(var i = 0; i < entries.length; i++) {
                        console.log(entries[i].entryName);
                        console.log(entries[i].isDirectory);
                        console.log(entries[i].getData());
                    }
    
                    fileName = path.resolve(__dirname, 'temp', id + '.zip');
                    
                    zip.writeZip(fileName);
                });
            });
    });
}

module.exports = {
    generateWordDoc: generateWordDoc,
    generateZip: generateZip,
    deleteTemporaryFiles: deleteTemporaryFiles
}