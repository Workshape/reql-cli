'use strict';
// Register babel module 
require('babel/register');

// Set where the config files are found
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || './config';

var config = {
  host : 'localhost',
  port : 28015
};

var r = require('rethinkdb');
var Promise = require('bluebird');
var Client = require('./lib/client');
var REPL = require('./lib/repl');

var client = new Client(r, config);
var repl = new REPL(client);

repl.start();