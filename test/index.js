"use strict";
var app = require('..');
var chai = require('chai');
var expect = chai.expect;
var crazy = require('../lib');

describe('the args object', function () {
    describe('options with dots in the name', function () {
        it('should parse to objects', function () {
            crazy.option({
                name: 'foo.bar',
                type: 'string'
            });
            var args = crazy.run([ '--foo.bar=qux' ]);
            expect(args.options.foo.bar).to.equal('qux');
        });
    });
    describe('options with `addToCollection`', function () {
        it('should be parsed and added into the collection property', function () {
            crazy.option({
                name: 'foo',
                type: 'csv,string',
                addToCollection: true
            });
            crazy.option({
                name: 'bar',
                type: 'csv,string',
                addToCollection: true
            });
            var args = crazy.run([ '--foo=bar,qux', '--bar=baz,zip' ]);
            expect(args.collection).to.be.an('array');
            expect(args.collection[0].foo).to.equal('bar');
            expect(args.collection[1].foo).to.equal('qux');
            expect(args.collection[0].bar).to.equal('baz');
            expect(args.collection[1].bar).to.equal('zip');
        });
        it('should omit for empty values when added to collection', function () {
            crazy.option({
                name: 'foo',
                type: 'csv,string',
                addToCollection: true
            });
            crazy.option({
                name: 'bar',
                type: 'csv,string',
                addToCollection: true
            });
            var args = crazy.run([ '--foo=,qux', '--bar=baz' ]);
            expect(args.collection).to.be.an('array');
            expect(args.collection[0].foo).to.be.an('undefined');
            expect(args.collection[1].foo).to.equal('qux');
            expect(args.collection[0].bar).to.equal('baz');
            expect(args.collection[1].bar).to.be.an('undefined');
        });
        it('should be parsed as objects options with dots in the name', function () {
            crazy.option({
                name: 'foo.bar',
                type: 'csv,string',
                addToCollection: true
            });
            crazy.option({
                name: 'foo.gee',
                type: 'csv,string',
                addToCollection: true
            });
            crazy.option({
                name: 'qux.zip',
                type: 'csv,string',
                addToCollection: true
            });
            var args = crazy.run([ '--foo.gee=well,wee', '--foo.bar=bam,doo', '--qux.zip=wer,boo' ]);
            expect(args.collection).to.be.an('array');
            expect(args.collection[0].foo.bar).to.equal('bam');
            expect(args.collection[0].foo.gee).to.equal('well');
            expect(args.collection[1].foo.bar).to.equal('doo');
            expect(args.collection[1].foo.gee).to.equal('wee');
            expect(args.collection[0].qux.zip).to.equal('wer');
            expect(args.collection[1].qux.zip).to.equal('boo');
        });
    });
});
