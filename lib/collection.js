
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
        } else {
            return result;
        }
    },

    insert: function(data, callback) {
        aproto.push.apply(this.__data, aproto.concat(data));
        this.__db.write(callback);
    },

    update: function(query, data, callback) {
        this.__data.forEach(function(item) {
            if (test(query, item)) {
                for (var key in data) {
                    item[key] = data[key];
                }
            }
        });

        this.__db.write(callback);
    },

    remove: function(query, callback) {
        var data = this.__data;

        for (var i = 0; i < data.length; i++) {
            if (test(query, data[i])) {
                data.splice(i, 1);
            }
        }

        this.__db.write(callback);
    }

};

module.exports = Collection;
