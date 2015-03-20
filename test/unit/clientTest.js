'use strict';
// Register babel module 
require('babel/register');

var Promise = require('bluebird');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);

var Client = require('../../lib/client');

describe('Client', function() {
  var expect = chai.expect;
  var assert = chai.assert;


  it('should be an Object', function() {
    var client = new Client({}, {});
    expect(client).to.be.an('Object');
  });

  describe('connect', function() {
    var r = { connect: sinon.stub().returns(Promise.resolve()) };

    it('should be a Function', function() {
      var client = new Client(r, {});
      expect(client.connect).to.be.a('Function');
    });

    it('should connect r', function() {
      var client = new Client(r, {});
      assert.isFulfilled(client.connect());
    });

    it('should return rejection when failed connection', function() {
      var r = { connect: sinon.stub().returns(Promise.reject()) };
      var client = new Client(r, {});
      assert.isRejected(client.connect());
    })
  });

  describe('setDb', function() {
    it('should be a Function', function() {
      var client = new Client({}, {});
      expect(client.setDb).to.be.a('Function');
    });

    it('should resolve when no arguments set', function() {
      var client = new Client({}, {db: 'test'});
      assert.isFulfilled(client.setDb());
      assert('test' === client.config.db);
    });

    it('should resolve and change db', function() {
      var client = new Client({}, {db: 'test'});
      assert.isFulfilled(client.setDb('test2'));
      assert('test2' === client.config.db);
    });
  });

  describe('getDbList', function() {
    it('should be a Function', function() {
      var client = new Client({}, {});
      expect(client.getDbList).to.be.a('Function');
    });
  });

  describe('getTableList', function() {
    it('should be a Function', function() {
      var client = new Client({}, {});
      expect(client.getTableList).to.be.a('Function');
    });
  });

  describe('handleResponse', function() {
    it('should be a Function', function() {
      var client = new Client({}, {});
      expect(client.handleResponse).to.be.a('Function');
    });
  });

  describe('evaluate', function() {
    var r = require('rethinkdb');
    it('should be a Function', function() {
      var client = new Client(r, {});
      expect(client.evaluate).to.be.a('Function');
    });

    it('should reject non valid command', function() {
      var client = new Client(r, {});
      assert(client.evaluate(r, 'r.foo()') === false)
    });

    it('should resolve when a valid command is passed', function() {
      var client = new Client(r, {});
      assert(client.evaluate(r, 'r.table("test")') !== false);
    });
  });

  describe('query', function() {
    var r = require('rethinkdb');
    it('should be a Function', function() {
      var client = new Client(r, {});
      expect(client.query).to.be.a('Function');
    });

    it('should reject no r. based command', function() {
      var client = new Client(r, {});
      assert.isRejected(client.query('xxx'))
    });
  });
});
