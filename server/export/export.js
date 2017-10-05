const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module')
const request = require('request');
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1'); //Timestamp-based uuid
const glob = require('glob');

var tpltId = 1

var downloadImage = function(uri) {
    return new Promise(function(resolve, reject) {
        var filePath = path.resolve(__dirname, 'temp', uuid() + path.extname(uri));
        
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

var generateWordDoc = function(article, tpltId) {
    return new Promise(function(resolve, reject) {
        var generateDoc = function(data) {
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

                var filename = path.resolve(__dirname, 'temp',  (data.image ? (path.basename(data.image).replace(/\.[^/.]+$/, "")) : uuid()) + '.docx')

                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                fs.writeFileSync(filename, buf);
                
                return resolve(path.basename(filename));
            });
        }
        
        if(article.imageUri) {
            return downloadImage(article.imageUri).then(function(imagePath) {

                data = {
                    "title":    article.title,
                    "text":     article.text,
                    "date":     new Date(),
                    image:      imagePath
                }

                return generateDoc(data).then(function(filename) {
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

                return generateDoc(data).then(function(filename) {
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

            return generateDoc(data).then(function(filename) {
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


module.exports = {
    generateWordDoc: generateWordDoc,
    deleteTemporaryFiles: deleteTemporaryFiles
}