
/**
 * Tests if the item matche query
 * @param {Object} query
 * @param {Object} item
 */
var test = function(query, item) {
    for (var key in query) {
        if (query[key] !== item[key]) {
            return false;
        }
    }

    return true;
};

var noop = function() {};
var aproto = Array.prototype;


/**
 * @class Collection
 * @param {fsdb} db
 * @param {Object} data
 */
var Collection = function(db, data) {
    this.__db = db;
    this.__data = data;
};

Collection.prototype = {

    find: function(query, callback) {
        var result = this.__data.filter(function(item) {
            return test(query, item);
        });

        if (callback) {
            callback(null, result);

            return this;
        } else {
            return result;
        }
    },

    insert: function(data, callback) {
        aproto.push.apply(this.__data, aproto.concat(data));

        if (callback) {
            this.__db.write(function(err, db) {
                err ? callback(err) : callback(null, data);
            });

            return this;
        } else {
            this.__db.write(noop);
            return data;
        }

    },

    update: function(query, data, callback) {
        var updated = [];

        this.__data.forEach(function(item) {
            if (test(query, item)) {
                for (var key in data) {
                    item[key] = data[key];
                }
                updated.push(item);
            }
        });

        if (callback) {
            this.__db.write(function(err, db) {
                err ? callback(err) : callback(null, updated);
            });

            return this;
        } else {
            this.__db.write(noop);
            return updated;
        }
    },

    remove: function(query, callback) {
        var removed = [];
        var data = this.__data;

        for (var i = 0; i < data.length; i++) {
            if (test(query, data[i])) {
                removed.push( data.splice(i, 1) );
            }
        }

        if (callback) {
            this.__db.write(function(err, db) {
                err ? callback(err) : callback(null, removed);
            });

            return this;
        } else {
            this.__db.write(noop);
        }
    }

};

module.exports = Collection;
