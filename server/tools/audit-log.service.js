

let write = function(event, status, msg) {
    let log = new Date() + ' -- ' + event + ' ' + (status ? 'SUCCESS' : 'FAILURE') + ': ' + msg;
    if(status === module.exports.SUCCESS) {
        console.log(log);
    } else if (status === module.exports.FAILURE) {
        console.err(log);
    }
}

module.exports = {
    SUCCESS: true,
    FAILURE: false,
    FILE: 'FILE',
    OBJECT: 'OBJECT',
    SYSTEM: 'SYSTEM',
    DATABASE: 'conduit_db',
    LOGIN: function(status, user) {
        let msg = 'User id \'' + ((typeof user === 'undefined') ? 'unknown' : user.id) + '\'';
        write('LOGIN', status, msg);
    },
    LOGOUT: function(status, user) {
        let msg = 'User id \'' + ((typeof user === 'undefined') ? 'unknown' : user.id) + '\'';
        write('LOGOUT', status, msg);
    },
    EXPORT: function(status, user, file) {
        let msg = 'User id \'' + ((typeof user === 'undefined') ? 'unknown' : user.id) + '\'' + ' EXPORT of FILE ' + file;
        write('EXPORT', status, msg);
    },
    DELETE: function(status, type, name, by) {
        let msg = type + ' ' + name + ' DELETE by ' + by;
        write('DELETE', status, msg);
    },
    CREATE: function(status, type, name, dest, by) {
        let msg = type + ' ' + name + ' CREATE to ' + dest + ' by ' + by;
        write('CREATE', status, msg);
    },
    INSERT: function(status, type, name, dest, by) {
        let msg = type + ' ' + name + ' INSERT to ' + dest + ' by ' + by;
        write('INSERT', status, msg);
    },
    ACCESS: function(status, type, name, by) {
        let msg = type  + ' ACCESS ' + name + ' by ' + by;
        write('ACCESS', status, msg);
    },
    MODIFY: function(status, type, name, by) {
        let msg = type  + ' MODIFY ' + name + ' by ' + by;
        write('MODIFY', status, msg);
    }
}