var request = require('request');

function save(exchange, buy, sell) {
  console.log('{exchange: ' + exchange + ', ' +
              'bid: '       + buy      + ', ' +
              'ask: '       + sell     + ', ' +
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

setInterval(function() {
  flow();
  fox();
}, 5000);
