const fs = require('fs');

module.exports = {
    readQueryFile: function(fileName) {
        return fs.readFileSync(fileName).toString()
        .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
        .replace(/\s+/g, ' '); // excess white space
    }, 
    rowToJson: function(row) {
        var json = {};
        if(row)
            for(var columnName in row)
                json[columnName] = row[columnName];
        console.log(json);
        return json;
    }
}