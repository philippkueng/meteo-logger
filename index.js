#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var async = require('async');
var request = require('superagent');
var spreadsheet = require('edit-google-spreadsheet');

var getVersionNumber = function () {
  return JSON.parse(fs.readFileSync('package.json')).version;
};

var fetchMeteoData = function (stationCode, callback) {
  request
    .get('http://data.netcetera.com/smn/smn/' + stationCode)
    .end(function(res) {
      callback(null, res.body);
    });
};

var convertToCsv = function(data, callback) {
  async.reject(Object.keys(data), function (item, callback) {
    if (item === 'station') {
      callback(true);
    } else {
      callback(false);
    }
  }, function (results) {
    async.mapSeries(results, function (item, callback) {
      callback(null, data[item]);
    }, function (err, results) {
      callback(null, results);
    });
  });
};

var saveInSpreadsheet = function (data, callback) {
  async.waterfall([
      function (callback) {
        callback(null, {
          debug: true,
          spreadsheetName: 'node-edit-spreadsheet',
          worksheetName: 'Sheet1',
          username: process.env.USERNAME,
          password: process.env.PASSWORD
        });
      },

      spreadsheet.load,

      // get spreadsheet info
      function (spreadsheet, callback) {
        spreadsheet.receive(function (err, rows, info) {
          callback(err, spreadsheet, info);
        });
      },

      // save in spreadsheet
      function (spreadsheet, info, callback) {
        var line = {};
        line[info.nextRow] = [data];
        spreadsheet.add(line);
        spreadsheet.send(function (err) {
          callback(err, 'done');
        });
      }
    ], function (err, result) {
      callback(null, result);
    });
}

/* CLI interface */

program
  .version(getVersionNumber());

program
  .command('fetch <station>')
  .description('fetch data for the given MeteoSchweiz Station Code')
  .action(function (station) {
    async.waterfall([

      // get the station code
      function (callback) {
        if (typeof station === 'string' && station.length === 3) {
          callback(null, station);
        } else {
          callback(new Error('Invalid station code'), null);
        }
      },
      fetchMeteoData,
      convertToCsv,
      saveInSpreadsheet
      ], function (err, result) {
        console.log(result);
      });

  }).on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ ./index fetch BEZ');
    console.log('    $ ./index fetch AIG');
    console.log('');
  });

program.parse(process.argv);
