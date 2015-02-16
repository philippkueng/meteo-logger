var request = require('superagent');

// make a sample request against the API
request
  .get('http://data.netcetera.com/smn/smn/BEZ')
  .end(function(res) {
    console.log(res.body);
  });
