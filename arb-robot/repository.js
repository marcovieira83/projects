var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/btcquotation';

module.exports = {
  insert: function(exchange, buy, sell, timestamp) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('quotations');
      collection.insertOne(
        {exchange: exchange, buy: buy, sell: sell, timestamp: timestamp}
      );
      db.close();
    });
  }
}
