const axios = require('axios');
const https = require('https');

//Find environment variables
var sso = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : undefined;
if(sso && sso['p-identity'])
    sso = sso['p-identity'][0].credentials;

var app = process.env.VCAP_APPLICATION ? JSON.parse(process.env.VCAP_APPLICATION) : undefined;

var user = {};

var REDIRECT_URL = function() {
    if(sso)
        return  sso.auth_domain +
                '/oauth/authorize?client_id=' + 
                sso.client_id +
                '&response_type-code&redirect_uri=http://' +
                app.uris[0];
    else
        console.error('SSO not found');
}

var authenticateUser = function (AUTH_CODE) {
    return new Promise(function(resolve, reject) {
        
        if(!sso || !app)
            return Promise.reject();

        var url =   sso.auth_domain +
                    '/oauth/token?grant_type=authorization_code&code=' +
                    AUTH_CODE +
                    '&redirect_uri=https://' +
                    app.uris[0];

        //Address self-signed cert error
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        var config = {
            headers: {
                'Authorization':'Basic ' + new Buffer(sso.client_id + ':' + sso.client_secret).toString('base64')
            },
            httpsAgent: agent
        }

        axios.get(url, config).then(function (res) {
            user.tokens = res.data;
            resolve(user);
            return Promise.resolve(user);
        }).catch(function(err) {
            console.error(err);
            return Promise.reject();
        });
    });
}

var getUserInfo = function (ACCESS_TOKEN) {
    return new Promise(function(resolve, reject) {

        ACCESS_TOKEN = ACCESS_TOKEN ? ACCESS_TOKEN : (user.tokens ? user.tokens.ACCESS_TOKEN : undefined)
        if(!ACCESS_TOKEN)
            return Promise.reject('No access token');
        if(!sso || !app)
            return Promise.reject();


        var url =   sso.auth_domain + 
                    '/userinfo';

        const agent = new https.Agent({
            rejectUnauthorized: false
        })

        var config = {
            headers: {
                'Authorization':'Bearer ' + ACCESS_TOKEN
            },
            httpsAgent: agent
        }

        axios.get(url, config).then(function (res) {
            user.info = res.data;
            resolve(user);
            return Promise.resolve(user);
        }).catch(function(err) {
            console.error(err);
            return Promise.reject();
        });
    });
}

var authorizeSession = function(req, res, next) {
    if(req.session.auth_token) {
        next();
    } else {
       req.session.auth_token = 'token';
       next();
    }   
}

module.exports = {
    REDIRECT_URL: REDIRECT_URL,
    authenticateUser: authenticateUser,
    authorizeSession: authorizeSession,
    getUserInfo: getUserInfo,
    user: user
}
