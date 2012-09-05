var path = require('path');
var expect = require('expect.js');
var fsdb = require('../../lib/fsdb');
var fixture = function(name) {
    return path.resolve('./test/fixtures/' + (name || 'rnd_' + (new Date()-0)) + '.json');
};

describe('fsdb', function() {

    describe('read', function() {

        beforeEach(function() {
            this.db = new fsdb();
            this.db.merge = function() {};
        });

        it('shoul read db', function(done) {
            this.db.path = fixture('read1');
            this.db.read(function(err, db) {
                expect(err).to.be(null);
                expect(db.data).to.eql(require(db.path));
                done();
            });
        });

        it('should return error for invalid json', function(done) {
            this.db.path = fixture('read2');
            this.db.read(function(err, db) {
                expect(err).not.to.be(null);
                done();
            });
        });

    });

    describe('write', function() {

        beforeEach(function() {
            this.db = new fsdb();
            this.db.merge = function() {};
        });

        it('shoul read db', function(done) {
            this.db.path = fixture();
            this.db.data = {a: 1, b: true, c: 'd'};
            this.db.write(function(err, db) {
                expect(err).to.be(null);
                expect(db.data).to.eql(require(db.path));
                done();
            });
        });

    });

});
