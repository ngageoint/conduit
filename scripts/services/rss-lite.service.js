/*Very simple RSS reader, supporting Atom 1.0 and RSS 2.0 only*/
angular.module('conduit.services').factory('RssLiteService', function($http) { 
	var readUrl = function(url) {
		return new Promise(function(resolve, reject) {
            
            var loadFeed = function(url, callback) {
                    $http.get(url).then(callback)
            }
                        
            loadFeed(url, function(response) {
                var parser = new DOMParser();
                var xml;
                xml = parser.parseFromString(response.data,"text/xml");

                //Atom 1.0 support
                var feed = xml.getElementsByTagName("feed")[0];
                var entries;
                if(feed)
                    entries = feed.getElementsByTagName("entry");
                //RSS 2.0 support
                else
                {
                    feed = xml.getElementsByTagName("channel")[0];
                    entries = feed.getElementsByTagName("item");
                }

                var parsed = [];
                for(var i = 0; i < entries.length; i++)
                {
                    var temp = {};
                    for(var j = 0; j < entries[i].childNodes.length; j++)
                    {
                        //if the entity child has a tag name, move to the child and work from there
                        if(entries[i].childNodes[j].tagName)
                        {
                            if(entries[i].childNodes[j].tagName === "link")
                            {
                                if(typeof entries[i].childNodes[j].attributes === "string")
                                {
                                    temp[entries[i].childNodes[j].tagName] = 
                                            entries[i].childNodes[j].attributes[k].nodeValue;
                                        continue;
                                }
                                for(var k = 0; k < entries[i].childNodes[j].attributes.length; k++)
                                    if(entries[i].childNodes[j].attributes[k].name === "href")
                                    {
                                        temp[entries[i].childNodes[j].tagName] = 
                                            entries[i].childNodes[j].attributes[k].nodeValue;
                                        break;
                                    }
                                if(temp[entries[i].childNodes[j].tagName])
                                    continue;
                            }

                            if(entries[i].getElementsByTagName(entries[i].childNodes[j].tagName)[0])
                            {
                                if(entries[i].getElementsByTagName(entries[i].childNodes[j].tagName)[0].childNodes[0])
                                    temp[entries[i].childNodes[j].tagName] = 
                                        entries[i].getElementsByTagName(entries[i].childNodes[j].tagName)[0].childNodes[0].nodeValue;
                                else
                                    temp[entries[i].childNodes[j].tagName] = 
                                        entries[i].getElementsByTagName(entries[i].childNodes[j].tagName)[0].textContent;
                            }
                            else
                            {
                                temp[entries[i].childNodes[j].tagName] = 
                                    entries[i].childNodes[j].textContent;
                            }
                        }    
                    }                
                                 
                    parsed.push(temp);
                }

                if(parsed)
                    resolve(parsed);
                else
                    reject();

                return Promise.resolve(parsed);
            });

           

        })
	};
	
	return {
	  readUrl: readUrl
    };
});