const fs = require('fs');
const path = require('path');

var sources = JSON.parse(fs.readFileSync(path.resolve('data', 'sources.json')));
console.log(sources);

module.exports = {
    sources: sources
}