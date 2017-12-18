Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }

module.exports = {
    format: {
        timestamptz: function(date) {
            //Format is YYYY-MM-DD HH24:MI:SS-TZ

            let YYYY = date.getFullYear();
            let MM = date.getMonth() + 1;
            let DD = date.getDate();

            let HH24 = date.getHours();
            let MI = date.getMinutes();
            let SS = date.getSeconds();

            let TZ = (date.getTimezoneOffset()/60).pad(2);

            return  YYYY + '-' + MM + '-' + DD + ' ' +
                    HH24 + ':' + MI + ':' + SS + '-' +
                    TZ;

        }
    }
}