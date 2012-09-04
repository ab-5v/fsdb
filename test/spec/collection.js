var expect = require('expect.js');
var Collection = require('../../lib/collection');

describe('collection', function() {

    beforeEach(function() {
        var fsdb = {
            write: function() {}
        };

        var data = require('../mock/collection1.json');

        this.c8n = new Collection(fsdb, data);
    });

    describe('find', function() {

        it('should find element', function(done) {
            this.c8n.find({a: '1'}, function(err, data) {
                expect(data).to.eql([{a: '1', b: '2'}]);
                done();
            });
        });

        it('should match strict types', function(done) {
            this.c8n.find({a: 1}, function(err, data) {
                expect(data).to.eql([{a: 1, b: '3'}]);
                done();
            });
        });

        it('should find all elements', function(done) {
            this.c8n.find({b: '2'}, function(err, data) {
                expect(data).to.eql([{a: '1', b: '2'}, {a: '4', b: '2'}]);
                done();
            });
        });

        it('should return empty array, when no elements found', function(done) {
            this.c8n.find({b: 'foo'}, function(err, data) {
                expect(data).to.eql([]);
                done();
            });
        });

        it('should match more than one condition', function(done) {
            this.c8n.find({a: '1', b: '2'}, function(err, data) {
                expect(data).to.eql([{a: '1', b: '2'}]);
                done();
            });
        });

        it('should work in sync style', function() {
            expect( this.c8n.find({a: '1'}) ).to.eql( [{a: '1', b: '2'}] );
        });

    });

    describe('insert', function() {
    });

    describe('update', function() {
    });

    describe('remove', function() {
    });

});
