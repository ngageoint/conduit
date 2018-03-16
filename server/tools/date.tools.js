Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }

module.exports = {
    format: {
        timestamptz: function(date) {
            //Format is YYYY-MM-DD HH24:MI:SS-TZ

            const YYYY = date.getFullYear();
            const MM = date.getMonth() + 1;
            const DD = date.getDate();

            const HH24 = date.getHours();
            const MI = date.getMinutes();
            const SS = date.getSeconds();

            const TZ = (date.getTimezoneOffset()/60).pad(2);

            return  YYYY + '-' + MM + '-' + DD + ' ' +
                    HH24 + ':' + MI + ':' + SS + '-' +
                    TZ;

        }
    }
}