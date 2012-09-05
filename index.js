var fsdb = require('./lib/fsdb');
fsdb.version = require('./package.json').version;

module.exports = {
    open: function(path, names, callback) {
        var cb = callback || function() {};
        var db = new fsdb(path, names, callback);

        db.open(function(err, db) {
            if (err) { return cb(err); }

            cb(null, db.collections);
        });

        if (!callback) {
            return db.collections;
        }
    }
};
