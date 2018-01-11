const fs = require('fs');

module.exports = {
    readQueryFile: function(fileName) {
        return fs.readFileSync(fileName).toString()
            .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
            .replace(/\s+/g, ' '); // excess white space
    }
}