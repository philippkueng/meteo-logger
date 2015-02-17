#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var request = require('superagent');
var spreadsheet = require('edit-google-spreadsheet');

var getVersionNumber = function() {
  return JSON.parse(fs.readFileSync('package.json')).version;
};

var fetchMeteoData = function(stationCode) {
  request
    .get('http://data.netcetera.com/smn/smn/' + stationCode)
    .end(function(res) {
      console.log(res.body);
    });
};

/* CLI interface */

program
  .version(getVersionNumber());

program
  .command('fetch <station>')
  .description('fetch data for the given MeteoSchweiz Station Code')
  .action(function(station) {
    fetchMeteoData(station);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ ./index fetch BEZ');
    console.log('    $ ./index fetch AIG');
    console.log('');
  });

program.parse(process.argv);
