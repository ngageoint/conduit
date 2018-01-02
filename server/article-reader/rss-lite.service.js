const axios = require('axios');
var xml2js = require('xml2js');

module.exports = {
    readUrl: function(url) {
		return new Promise(function(resolve, reject) {
            var config = {
                //TODO: Add auth config info
            }
    
            axios.get(url, config).then(function(response) { 
                //return new Promise(function(resolve, reject) {
                var parser = new xml2js.Parser({ignoreAttrs : false, mergeAttrs : true})
                var parseString = parser.parseString;
                var xml = response.data

                parseString(xml, function (err, res) {
                    xml = res;
                });
                var entries;
                var parsed = [];

                //Atom 1.0 support
                if(xml.feed) {
                    entries = xml.feed.entry;
                }
                //RSS 2.0 support
                else {
                    entries = xml.channel.item;
                }

                for(var i = 0; i < entries.length; i++) {
                    var temp = {};
                    var keys = Object.keys(entries[i]);

                    for(var j = 0; j < keys.length; j++) {
                        if(keys[j] === "link") {
                            if(entries[i].link[0].href) {
                                temp.link = entries[i].link[0].href.toString()
                            }
                        } else {
                            temp[keys[j]] = entries[i][keys[j]][0];
                        }
                    }
                    parsed.push(temp);
                }

                if(parsed) {
                    return resolve(parsed);
                } else {
                    return reject();
                }
            }).catch(function(err) {
                console.error(err);
                return reject(err);
            })
        });                    
	}
}