var request = require('request');
const repository = require('./repository.js');

function save(exchange, buy, sell) {
  console.log('{exchange: "' + exchange  + '", ' +
              'buy: '        + buy       + ', ' +
              'sell: '       + sell      + ', ' +
              'timestamp: "' + timestamp + '"}');

  repository.insert(exchange, buy, sell, timestamp);
}

function flow() {
  request('https://api.flowbtc.com:8400/GetTicker/BTCBRL/', function(e, resp, body) {
    if (!e && resp.statusCode == 200) {
      var parsed = JSON.parse(body);
      save('flow', parsed.bid, parsed.ask);
    }
  });
}

function fox() {
  request('https://api.blinktrade.com/api/v1/BRL/ticker', function(e, resp, body) {
    if (!e && resp.statusCode == 200) {
      var parsed = JSON.parse(body);
      save('fox', parsed.buy, parsed.sell);
    }
  });
}

function negociecoins() {
  request('http://www.negociecoins.com.br/api/v3/BTCBRL/ticker', function(e, resp, body) {
    if (!e && resp.statusCode == 200) {
      var parsed = JSON.parse(body);
      save('negociecoins', parsed.buy, parsed.sell);
    }
  });
}

var timestamp = new Date();
var defaultInterval = 1;
var argsInterval = process.argv[2];

if (argsInterval) console.log("Custom interval informed: " + argsInterval);
else console.log("Using default interval: " + defaultInterval);

var intervalInMinutes = argsInterval ? argsInterval : defaultInterval;
console.log("Starting robot... Interval (minutes): " + intervalInMinutes +
            ". Now: " + timestamp);

setInterval(function() {
  timestamp = new Date();
  flow();
  fox();
  negociecoins();
}, intervalInMinutes * 60 * 1000);
