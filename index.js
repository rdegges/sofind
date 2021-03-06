#!/usr/bin/env node
'use strict';

var util = require('util');

var request = require('request');
var yargs = require('yargs');
var zlib = require('zlib');

var SO_URL = 'https://api.stackexchange.com/2.2/tags/%s/top-answerers/month?pagesize=100&site=stackoverflow';

function logUsers(json) {
  for (var i = 0; i < json.items.length; i++) {
    console.log(json.items[i].user.link);
  }
}

function main() {
  var argv = yargs.argv;

  if (argv._.length === 0) {
    console.log('Usage: sofind <tag>');
    process.exit(1);
  }

  var tag = encodeURIComponent(argv._[0]);

  request(util.format(SO_URL, tag), { encoding: null }, function(err, resp, body) {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      if (resp.statusCode != 200) {
        console.log('SO API request failed with status code: ' + resp.statusCode);
        process.exit(1);
      }

      zlib.gunzip(body, function(err, unzipped) {
        var json = JSON.parse(unzipped.toString());
        logUsers(json);
      });
  });
}

main();
