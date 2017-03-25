var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('Blockchain', function() {
  describe('receiveFirtBlock', function() {
    it('should receive transactions', function() {
      miner.newTx()
    });
  });
});