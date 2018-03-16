var RateLimit = require('express-rate-limit');

module.exports = {
    restricted: new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 20,
        delayMs: 5 * 1000,//5 seconds
        delayAfter: 5
    }),
    frontloaded:  new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 500,
        delayMs: 250,
        delayAfter: 250
    }),
    frontloadedRestricted:  new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 50,
        delayMs: 250,
        delayAfter: 20
    }),
    intermittent:  new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 1000,
        delayMs: 0
    }),
    intermittentRestricted:  new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 100,
        delayMs: 0
    }),
    immediate: new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 1000,
        delayMs: 0
    }),
    immediateRestricted: new RateLimit({
        windowMs: 5 * 60 * 1000, //10 minutes
        max: 100,
        delayMs: 0
    })
}