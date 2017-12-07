const RssLiteService = require('./rss-lite.service.js');

RssLiteService.readUrl('https://alerts.weather.gov/cap/us.php?x=1').then(function(res) {
        console.log(res);
    }).catch(function(err) {
        console.log(err);
    });

module.exports = {
 
}