var request = require('request');

function save(exchange, buy, sell) {
  console.log('{exchange: ' + exchange + ', ' +
              'buy: '       + buy      + ', ' +
              'sell: '       + sell     + ', ' +
              'timestamp: ' + new Date() + '}');
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

var intervalInMinutes = 1;
console.log("Starting robot... Interval (minutes): " + intervalInMinutes);

setInterval(function() {
  flow();
  fox();
  negociecoins();
}, intervalInMinutes * 60 * 1000);
