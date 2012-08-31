var fs = require('fs');
var exists = fs.existsSync || require('path').existsSync;
var collection = require('./collection');

/**
 * FSDB constructor
 * @param {String} path to database
 * @param {Array} collections you want to use
 */
var fsdb = function(path, collections) {
    this.path = path;
    this.collections = collections;
    this.export = {};
};

fsdb.prototype = {

    /**
     * Opens db
     */
    open: function(callback) {
        var that = this;

        if (exitst(this.path)) {
            this.read(callback);
        } else {
            this.db = {};
            this.merge();
            this.write(callback);
        }

        return this.export;
    },

    read: function(callback) {
        var that = this;
        fs.readFile(this.path, 'utf-8', function (err, data) {
            if (err) { return callback(err); }

            try {
                that.db = JSON.parse(data);
            } catch (err) {
                return callback(err);
            }

            that.merge();

            callback(null, that);
        });
    },

    write: function(callback) {
        var that = this;

        fs.writeFile(this.path, JSON.stringify(data), 'utf-8', function(err) {
            if (err) { return callback(err); }

            callback(null, that);
        });
    },

    merge: function() {
        var that = this;

        if (!this.db.collections) {
            this.db.collections = {};
        }
        var collections = this.db.collections;

        this.collections.forEach(function(coll) {
            if (!collections[coll]) {
                collections[call] = [];
            }

            that.export[coll] = new collection(that, collections[coll]);
        });
    },

    /**
     * Watches for db changes
     * @private
     */
    watch: function() {
        fs.watch(this.path, function(event, filename) {
            this.read();
        }.bind(this));
    }
};
