var expect = require('expect.js');
var Collection = require('../../lib/collection');
var mock = function(name) {
    return JSON.parse( JSON.stringify( require('../mock/' + name + '.json') ) );
};

describe('collection', function() {

    beforeEach(function() {
        this.fsdb = {
            write: function(callback) {
                if (callback) { callback(); }
            }
        };
    });

    describe('find', function() {

        beforeEach(function() {
            this.data = mock('collection1');
            this.c8n = new Collection(this.fsdb, this.data);
        });

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

        it('should find few elements', function(done) {
            this.c8n.find({b: '2'}, function(err, data) {
                expect(data).to.eql([{a: '1', b: '2'}, {a: '4', b: '2'}]);
                done();
            });
        });

        it('should find all elements with empty query', function(done) {
            this.c8n.find({}, function(err, data) {
                expect(data).to.eql([{a: '1', b: '2'}, {a: 1, b: '3'}, {a: '4', b: '2'}]);
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
        beforeEach(function() {
            this.data = [];
            this.c8n = new Collection(this.fsdb, this.data);
        });

        it('should insert element', function(done) {
            var that = this;
            this.c8n.insert({a: '1'}, function(err, data) {
                expect(that.data).to.eql([{a: '1'}]);
                done();
            });
        });

        it('should insert few elements', function(done) {
            var that = this;
            this.c8n.insert([{a: '2'}, {b: '3'}], function(err, data) {
                expect(that.data).to.eql([{a: '2'}, {b: '3'}]);
                done();
            });
        });
    });

    describe('update', function() {

        beforeEach(function() {
            this.data = mock('collection1');
            this.c8n = new Collection(this.fsdb, this.data);
        });

        it('should update one element', function(done) {
            var that = this;
            this.c8n.update({a: '4'}, {b: '5'}, function(err, data) {
                expect(that.data).to.eql([{a: '1', b: '2'}, {a: 1, b: '3'}, {a: '4', b: '5'}]);
                done();
            });
        });

        it('should update few elements', function(done) {
            var that = this;
            this.c8n.update({b: '2'}, {a: '5'}, function(err, data) {
                expect(that.data).to.eql([{a: '5', b: '2'}, {a: 1, b: '3'}, {a: '5', b: '2'}]);
                done();
            });
        });

        it('should not update elements', function(done) {
            var that = this;
            this.c8n.update({b: 'foo'}, {a: '5'}, function(err, data) {
                expect(that.data).to.eql([{a: '1', b: '2'}, {a: 1, b: '3'}, {a: '4', b: '2'}]);
                done();
            });
        });

    });

    describe('remove', function() {

        beforeEach(function() {
            this.data = mock('collection1');
            this.c8n = new Collection(this.fsdb, this.data);
        });

        it('should remove one element', function(done) {
            var that = this;
            this.c8n.remove({a: 1}, function(err, data) {
                expect(that.data).to.eql([{a: '1', b: '2'}, {a: '4', b: '2'}]);
                done();
            });
        });

        it('should remove few elements', function(done) {
            var that = this;
            this.c8n.remove({b: '2'}, function(err, data) {
                expect(that.data).to.eql([{a: 1, b: '3'}]);
                done();
            });
        });

        it('should not update elements', function(done) {
            var that = this;
            this.c8n.remove({b: 'foo'}, function(err, data) {
                expect(that.data).to.eql([{a: '1', b: '2'}, {a: 1, b: '3'}, {a: '4', b: '2'}]);
                done();
            });
        });

    });

});
