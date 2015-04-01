'use strict';
// Register babel module 
require('babel/register');

// Set where the config files are found
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || './config';

var opt = require('optimist')
  .usage('Usage: $0 -h [host] -p [post] -d [db]')
  .default('h' , 'localhost')
  .default('p', 28015)
  .default('d', 'test');

var config = {
  host : opt.argv.h,
  port : opt.argv.p,
  db: opt.argv.d
};

if (opt.argv.help) {
  opt.showHelp(console.log);
  process.exit();
}

var r = require('rethinkdb');
var Promise = require('bluebird');
var Client = require('./client');
var REPL = require('./repl');

var client = new Client(r, config);
var repl = new REPL(client);

repl.start();