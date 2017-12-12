/* The ArticleBookService makes all of the articles in the article book available in a global, editable promise. */
angular.module('conduit.services').factory('FilterService', function(DateTools, ComplexPropertyTools, __config) { 

    /*
    filter
    build(sources, articles)
    determineShow(article, sources, attributes)
    updateOptions: sources, source, articles, filter, attributes)
    */

    //var filter = ;

    return {
        filter: {
            count: 0,
            MAX_DAYS_BACK: __config.MAX_DAYS_BACK,
            DEFAULT_DAYS_BACK: __config.DEFAULT_DAYS_BACK,
            daysBack: __config.DEFAULT_DAYS_BACK,
            trash: 0
        },
        build: function (sources, articles){
            var buildValue = function(value) {
                //Values in the filter are JSON objects with the topic name and a field to track whether or not it is checked; this is bound to the dropdowns.
                value.checked = false;
                value.show = true;
                return value;
            }

            var newValue = function(value) {
                //Determine if the topic has already been included; if not, add it.;
                for(var m = 0; m < sources[j].filter[k].values.length; m++)
                    if(~sources[j].filter[k].values[m].data.indexOf(value['data']))
                        return false;
                return true;
            }

            this.filter.count = articles.length;

            //Populate our data sources filter attributes with values found in the articles
            for(var i = 0; i < articles.length; i++)
            {						
                for(var j = 0; j < sources.length; j++)
                {
                    if(~articles[i].source.indexOf(sources[j].name))
                        for(var k = 0; k < sources[j].filter.length; k++)
                            if(sources[j].filter[k].binding.property)
                            {
                                var boundProp = ComplexPropertyTools.getComplexProperty(articles[i], sources[j].filter[k].binding.property)
                                if(boundProp)
                                {
                                    if(typeof boundProp === "string")
                                    {
                                        value = {
                                            data: boundProp,
                                            name: boundProp
                                        };
                                        value = buildValue(value)        
                                            if(newValue(value))
                                                sources[j].filter[k].values.push(value);
                                    }
                                    else
                                    {
                                        for(var l = 0; l < boundProp.length; l++)
                                        {
                                            var value = {};
                                            if(sources[j].filter[k].binding.data)
                                            {
                                                var boundData = ComplexPropertyTools.getComplexProperty(boundProp[l], sources[j].filter[k].binding.data)
                                                
                                                if(boundData)
                                                    value.data = boundData.trim();
                                                else
                                                    value.data = boundProp[l].trim();
                                            }
                                            else
                                                value.data = boundProp[l].trim();
                                            
                                            if(sources[j].filter[k].binding.name)
                                            {
                                                var boundName = ComplexPropertyTools.getComplexProperty(boundProp[l], sources[j].filter[k].binding.name)
                                                
                                                if(boundName)
                                                    value.name = boundName.trim();
                                                else
                                                    value.name = value.data;
                                            }
                                            else
                                                value.name = value.data;

                                            value = buildValue(value)        
                                            if(newValue(value))
                                                sources[j].filter[k].values.push(value);
                                        }
                                    }
                                }
                            }
                }
            }
      
            //Sort and cleanup
            for(var i = 0; i < sources.length; i++)
                for(var j = 0; j < sources[i].filter.length; j++)
                {
                    sources[i].filter[j].values.sort(function(a, b){return a['data'].localeCompare(b['data'])});
                    //Add a 'none' option to end of each topic list
                    //sources[i].filter[j].values.push({data: "None", checked:false});	
                }

            return sources;
        },
        determineShow: function (article, sources, attributes) {
            if(!sources)
                return true;
            
            if(!DateTools.isNewerThan(article.date, this.filter.daysBack))
                return false;
                    
            //Filter trash first because it is the cheapest calculation
            if(!this.filter.trash && article.removed)
                return false;
            if(this.filter.trash && !article.removed)
                return false;
            if(this.filter.trash && article.removed)
                return true;
                        
            //Filter by source second because it can cheaply eliminate many articles
            var srcChecked = false;
            if(!sources.length)
                sources = [sources];
            for(var i = 0; i < sources.length; i++)
                if(sources[i] && sources[i].checked && ~article.source.indexOf(sources[i].name))
                    srcChecked = true;
            if(!srcChecked)
                return false;	
            
            for(var i = 0; i < attributes.length; i++)
                if(attributes[i] && attributes[i].checked)
                    if(article[attributes[i].compare])
                    {
                        if((typeof(article[attributes[i].compare]) === "boolean") && !article[attributes[i].compare])
                            return false;
                        if(article[attributes[i].compare].constructor === Array && article[attributes[i].compare].length < 1)
                            return false;
                    }
                    
            //Find out if a source has been selected, but no filter has been applied; show all from that source if true
            //For all of the sources
            for(var s = 0; s < sources.length; s++)
            {	
                //If the source is not checked or this article is not from this source, it doesn't matter so move on
                if(sources[s] && !sources[s].checked || !~article.source.indexOf(sources[s].name))
                    continue;
                //If this source is checked AND this article is from the sources
                if(sources[s] && sources[s].checked && ~article.source.indexOf(sources[s].name))
                {
                    //Then look through all of the filters of the source
                    for(var f = 0; f < sources[s].filter.length; f++)
                    {
                        //If one of the filters is checked, then we can't use this shortcut for this filter, so break;
                        if(sources[s] && sources[s].filter[f].selectedValues && sources[s].filter[f].selectedValues.length != 0)
                            break;
                        //If we've made it this far and exhausted all of the possible filters for this source, return true because the article will be shown
                        if(sources[s] && f == sources[s].filter.length - 1)
                            return true;
                    }
                }
            }

            //And now we get to the complicated stuff...
            //For every source
            var globalMatch = true;
            for(var s = 0; s < sources.length && globalMatch; s++)
            {
                if(!~article.source.indexOf(sources[s].name))
                        continue;
                //And every filter of every source
                for(var f = 0; f < sources[s].filter.length && globalMatch; f++)
                {
                    //If the selected values are null or empty, try the next source because nothing else needs to be done in this iteration
                    if(!sources[s].filter[f].selectedValues || (sources[s].filter[f].selectedValues && sources[s].filter[f].selectedValues.length <= 0))
                        continue;
                            
                    var hasMatch = false;//A match was found between the filter and the article binding
                    
                    //For all of the article binding elements, as long as we haven't found a match yet
                    var boundProp = ComplexPropertyTools.getComplexProperty(article, sources[s].filter[f].binding.property)
                    
                    if(typeof boundProp === "string")
                    {
                        for(var v = 0; v < sources[s].filter[f].selectedValues.length && !hasMatch; v++)
                                if(sources[s].filter[f].selectedValues[v] && ~boundProp.indexOf(sources[s].filter[f].selectedValues[v]))
                                    hasMatch = true;
                    }
                    else
                    {
                        for(var p = 0; p < boundProp.length && !hasMatch; p++)
                        {
                            var boundData = boundProp[p];
                            if(sources[s].filter[f].binding.data)
                                boundData = ComplexPropertyTools.getComplexProperty(boundProp[p], sources[s].filter[f].binding.data);
                            if(boundData)
                                for(var v = 0; v < sources[s].filter[f].selectedValues.length && !hasMatch; v++)
                                    if(sources[s].filter[f].selectedValues[v] && ~boundData.indexOf(sources[s].filter[f].selectedValues[v]))
                                        hasMatch = true;
                        }
                    }
                    if(!hasMatch)
                        globalMatch = false;
                }
            }
            if(!globalMatch)
                return false;

            return true;
        },
        updateOptions: function (sources, source, articles, filter, attributes) {
            if(!sources || !source || !articles || !filter || !attributes)
                return sources;

            if(!sources.length)
                sources = [sources];
            //Identify which source we are working with					
			for(var s = 0; s < sources.length; s++)//
				if(~sources[s].name.indexOf(source))
				{
					source = s;
					break;	
				}

            if(typeof source === "string")
                return sources;
						
			var loneFilter = true; //flag whether or not the filter is operating on its own, or in conjunction with others
			
			//Identify which filter we are working with
			for(var f = 0; f < sources[source].filter.length; f++)
			{
				if(~sources[source].filter[f].name.indexOf(filter))
					filter = f;
				//If we're looking at a filter that has selected values, and it's not the filter we want to be looking at, set the loneFilter flag to false
				if(filter != f && (sources[source].filter[f].selectedValues && sources[source].filter[f].selectedValues.length > 0))
					loneFilter = false;						
			}
					
			//Set all the filter values equal to the loneFilter; show all if the filter is operating on its own, or hide all if the filter is working with other filters
			for(var v = 0; v < sources[source].filter[filter].values.length; v++)
				sources[source].filter[filter].values[v].show = false;
				

			//If it's a lone filter, we can return now since all we're doing is showing everything
			if(loneFilter)
			{
				for(var p = 0; p < articles.length; p++)
					if(DateTools.isNewerThan(articles[p].date, this.filter.daysBack))
                        if(sources && sources[source])
                            sources[source] = this.setShowValuesTrue(articles[p], filter, sources[source]);  	
                return sources;
			}
								
			var temp = sources[source].filter[filter].selectedValues;
			sources[source].filter[filter].selectedValues = '';
						
			//Go through all of the articles
			for(var p = 0; p < articles.length; p++)
				//If the article is currently being shown...
				if(this.determineShow(articles[p], sources, attributes))
                    if(sources && sources[source])
                        sources[source] = this.setShowValuesTrue(articles[p], filter, sources[source]); 
				
    		sources[source].filter[filter].selectedValues = temp;
            return sources;
        },
        //For a given article, filter, and source, determine which source filter values' "show value" should be true.
        //eg, if the source is example, the filter is topic, and the article contains the topic "doggos", set example.topic.doggos.show to true
        setShowValuesTrue: function(article, filter, source)
        {
            var boundProp = ComplexPropertyTools.getComplexProperty(article, source.filter[filter].binding.property)
			if(typeof boundProp === "undefined")
                return source;
            if(typeof boundProp === "string")
            {
                var boundData = boundProp;
                if(source.filter[filter].binding.data)
                        boundData = ComplexPropertyTools.getComplexProperty(boundProp, source.filter[filter].binding.data);
                    for(var fv = 0; fv < source.filter[filter].values.length; fv++)
                            //If our visible article has bound data that matches the filter, then we'll go ahead and show that filter value
                        if(~boundData.indexOf(source.filter[filter].values[fv].data))	
                            source.filter[filter].values[fv].show = true
            }
            else {
                for(var pv = 0; pv < boundProp.length; pv++)
                {
                    var boundData = boundProp[pv];
                    if(source.filter[filter].binding.data)
                         boundData = ComplexPropertyTools.getComplexProperty(boundProp[pv], source.filter[filter].binding.data);
                    for(var fv = 0; fv < source.filter[filter].values.length; fv++)
                    {
                        if(~boundData.indexOf(source.filter[filter].values[fv].data))	
                                 source.filter[filter].values[fv].show = true;
                    }
                }
            }

            return source;
        }
    }
});