var fs = require('fs');
var exists = fs.existsSync || require('path').existsSync;
var collection = require('./collection');

/**
 * FSDB constructor
 * @param {String} path to database
 * @param {Array} collections you want to use
 * @param {Function} callback
 */
var fsdb = function(path, cnames) {
    this.path = path;
    this.cnames = cnames;
    this.collections = {};
};

fsdb.prototype = {

    /**
     * Opens db
     */
    open: function(callback) {
        var that = this;

        if (exists(this.path)) {
            this.read(callback);
        } else {
            this.data = {};
            this.merge();
            this.write(callback);
        }
    },

    read: function(callback) {
        var that = this;
        fs.readFile(this.path, 'utf-8', function (err, data) {
            if (err) { return callback(err); }

            try {
                that.data = JSON.parse(data);
            } catch (e) {
                return callback(e);
            }

            that.merge();

            callback(null, that);
        });
    },

    write: function(callback) {
        var that = this;

        fs.writeFile(this.path, JSON.stringify(this.data), 'utf-8', function(err) {
            if (err) { return callback(err); }

            callback(null, that);
        });
    },

    merge: function() {
        var that = this;

        if (!this.data._c) {
            this.data._c = {};
        }
        var collections = this.data._c;

        this.cnames.forEach(function(name) {
            if (!collections[name]) {
                collections[name] = [];
            }

            that.collections[name] = new collection(that, collections[name]);
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

module.exports = fsdb;
